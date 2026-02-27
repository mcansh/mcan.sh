import fullstack from "@hiogawa/vite-plugin-fullstack"
import type {
	Directive,
	ExportNamedDeclaration,
	Program,
	Statement,
} from "@oxc-project/types"
import ts from "dedent"
import MagicString from "magic-string"
import type { PluginOption } from "vite"

export function remix({
	serverEnvironments: _environments = ["ssr"],
	serverHandler = true,
}: {
	serverEnvironments?: Array<string>
	serverHandler?: boolean
} = {}): PluginOption {
	const environments = new Set(_environments)
	const clientReferences = new Set<string>()

	return [
		fullstack({
			serverEnvironments: _environments,
			serverHandler,
		}),
		{
			name: "use-client-transform",
			transform(code, id) {
				if (!code.match(/\buse client\b/)) return

				const program = this.parse(code)
				if (hasDirective(program.body, "use client")) {
					const ms = new MagicString(code)

					if (environments.has(this.environment.name)) {
						transformUseClient(ms, program, id, clientReferences)
					} else {
						removeUseClient(ms, program)
					}

					return {
						code: ms.toString(),
						map: ms.generateMap({ source: id }),
					}
				}
			},
		},
	]
}

function transformUseClient(
	ms: MagicString,
	program: Program,
	id: string,
	clientReferences: Set<string>,
) {
	if (!hasHydrateImport(program.body)) {
		addHydrateImport(ms)
	}

	let hasExports = false
	for (const exportedFunction of getExportedFunctions(program.body)) {
		hasExports = true
		removeExport(ms, exportedFunction)
		reExportAsHydrated(ms, exportedFunction, id)
	}
	if (hasExports) {
		clientReferences.add(id)
	}
}

function removeUseClient(ms: MagicString, program: Program) {
	for (const node of program.body) {
		if (
			node.type === "ExpressionStatement" &&
			"directive" in node &&
			node.directive === "use client"
		) {
			const nodeWithRange = node as any
			ms.remove(nodeWithRange.start, nodeWithRange.end)
			break
		}
	}
}

function hasDirective(body: Array<Directive | Statement>, directive: string) {
	return body.some(
		(node) =>
			node.type === "ExpressionStatement" &&
			"directive" in node &&
			node.directive === directive,
	)
}

type ExportedFunction = {
	name: string
	node: ExportNamedDeclaration
	start: number
	end: number
}

function getExportedFunctions(body: Array<Statement | Directive>) {
	const exportedFunctions: Array<ExportedFunction> = []

	for (const node of body) {
		if (node.type === "ExportNamedDeclaration") {
			if (!node.declaration) continue

			if (node.declaration.type === "VariableDeclaration") {
				for (const declarator of node.declaration.declarations) {
					if (
						declarator.type === "VariableDeclarator" &&
						declarator.id?.type === "Identifier" &&
						declarator.init?.type &&
						["FunctionExpression", "ArrowFunctionExpression"].includes(
							declarator.init.type,
						)
					) {
						exportedFunctions.push({
							name: declarator.id.name,
							node: node,
							start: node.start,
							end: node.end,
						})
					}
				}
			} else if (node.declaration.type === "FunctionDeclaration") {
				exportedFunctions.push({
					name: node.declaration.id?.name || "",
					node: node,
					start: node.start,
					end: node.end,
				})
			}
		}
	}

	return exportedFunctions
}

function removeExport(ms: MagicString, exportedFunction: ExportedFunction) {
	const exportStart = exportedFunction.start
	const declarationStart = exportedFunction.node.declaration?.start
	if (typeof declarationStart === "undefined") {
		throw new Error(
			`could not find node's declaration start position for "${exportedFunction.name}"`,
		)
	}
	ms.remove(exportStart, declarationStart)
}

function reExportAsHydrated(
	ms: MagicString,
	exportedFunction: ExportedFunction,
	id: string,
) {
	const functionName = exportedFunction.name
	const hydratedName = `${functionName}Hydrated`

	const hydratedExport = ts`
		import ___${functionName}Assets from "${id}?assets=client";

		let jsAssets = ___${functionName}Assets.js.map(a => a.href);
		let assets = [___${functionName}Assets.entry, ...jsAssets];

		let ___${functionName}AssetsDeduped = Array.from(new Set(assets));
		let ${hydratedName} = Remix.clientEntry(JSON.stringify(___${functionName}AssetsDeduped) + "#${functionName}", ${functionName});
		export { ${hydratedName} as ${functionName} };
	`

	ms.append(hydratedExport)
}

function hasHydrateImport(body: Array<Directive | Statement>) {
	return body.some((node) => {
		if (
			node.type === "ImportDeclaration" &&
			node.source.type === "Literal" &&
			node.source.value === "remix/component"
		) {
			return node.specifiers.some((spec) => {
				return (
					spec.type === "ImportNamespaceSpecifier" &&
					spec.local.name === "Remix"
				)
			})
			// return node.specifiers.some((spec) => {
			// 	return (
			// 		spec.type === "ImportSpecifier" &&
			// 		spec.imported.type === "Identifier" &&
			// 		spec.imported.name === "clientEntry"
			// 	)
			// })
		}
		return false
	})
}

function addHydrateImport(ms: MagicString) {
	ms.prepend(
		// `import { clientEntry as ___clientEntry } from "remix/component";\n`,
		`import * as Remix from "remix/component";\n`,
	)
}
