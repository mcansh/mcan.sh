// src/index.ts
import fse from "fs-extra";
import { hash } from "hasha";
import path from "node:path";
import svgo from "svgo";
import svgstore from "svgstore";
var svgRegex = /\.svg$/;
var PLUGIN_NAME = "@mcansh/vite-plugin-svg-sprite";
var virtualModuleId = `virtual:${PLUGIN_NAME}`;
var resolvedVirtualModuleId = "\0" + virtualModuleId;
var js = String.raw;
function createSvgSpritePlugin(configOptions) {
	console.warn(
		`createSvgSpritePlugin has been renamed to svgSprite, please update your imports as this will be removed in a future release.`,
	);
	return svgSprite(configOptions);
}
var DEFAULT_COPY_ATTRS = [
	"fill",
	"stroke",
	"stroke-width",
	"stroke-linecap",
	"stroke-linejoin",
	"stroke-dasharray",
	"stroke-dashoffset",
];
function svgSprite(configOptions) {
	let config;
	let options = {
		spriteOutputName: "sprite.svg",
		symbolId: "icon-[name]-[hash]",
		logging: false,
		svgstoreOptions: {},
		...configOptions,
	};
	let store = svgstore({
		renameDefs: true,
		copyAttrs: DEFAULT_COPY_ATTRS,
		...options.svgstoreOptions,
	});
	let icons = /* @__PURE__ */ new Map();
	let iconsAdded = /* @__PURE__ */ new Set();
	let referenceId;
	async function addIconToSprite(id, content) {
		if (!content) content = await fse.readFile(id, "utf-8");
		let basename = path.basename(id, ".svg");
		let symbolId = options.symbolId;
		if (options.symbolId.includes("[name]")) {
			symbolId = symbolId.replace("[name]", basename);
		}
		if (options.symbolId.includes("[hash]")) {
			let contentHash = await hash(id);
			symbolId = symbolId.replace("[hash]", contentHash);
		}
		icons.set(symbolId, content);
		return symbolId;
	}
	async function getSpriteHash() {
		let sorted = Array.from(icons).sort((a, b) => {
			return a[0].localeCompare(b[0]);
		});
		for (let [id, content] of sorted) {
			if (iconsAdded.has(id)) continue;
			iconsAdded.add(id);
			store.add(id, content);
		}
		let optimized = svgo.optimize(store.toString(), {
			plugins: [
				{
					name: "preset-default",
					params: {
						overrides: {
							removeHiddenElems: false,
							removeUselessDefs: false,
							cleanupIds: false,
						},
					},
				},
			],
		});
		let spriteHash = await hash(optimized.data);
		return { data: optimized.data, spriteHash };
	}
	function log(...args) {
		print("log", ...args);
	}
	function warn(...args) {
		print("warn", ...args);
	}
	function error(...args) {
		print("error", ...args);
	}
	function print(type, ...args) {
		if (options.logging === false) return;
		switch (type) {
			case "log":
				console.log(`[${PLUGIN_NAME}]`, ...args);
				break;
			case "warn":
				console.warn(`[${PLUGIN_NAME}]`, ...args);
				break;
			case "error":
				console.error(`[${PLUGIN_NAME}]`, ...args);
				break;
		}
	}
	return [
		{
			name: PLUGIN_NAME,
			resolveId(id) {
				if (id === virtualModuleId) {
					return resolvedVirtualModuleId;
				}
			},
			async load(id) {
				if (id === resolvedVirtualModuleId) {
					let spriteUrl = `/${config.build.assetsDir}/${options.spriteOutputName}`;
					return js`export default ${JSON.stringify(spriteUrl)}`;
				}
			},
			configResolved(resolvedConfig) {
				config = resolvedConfig;
			},
			async transform(_code, id) {
				if (svgRegex.test(id)) {
					let spriteUrl = `/${config.build.assetsDir}/${options.spriteOutputName}`;
					let symbolId = await addIconToSprite(id);
					return {
						code: js`export default "${spriteUrl}#${symbolId}";`,
						map: { mappings: "" },
					};
				}
			},
			async buildEnd() {
				let { data } = await getSpriteHash();
				referenceId = this.emitFile({
					type: "asset",
					source: data,
					name: options.spriteOutputName,
				});
			},
		},
	];
}
export { createSvgSpritePlugin, DEFAULT_COPY_ATTRS, svgSprite };
