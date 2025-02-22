"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
	for (var name in all)
		__defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
	if ((from && typeof from === "object") || typeof from === "function") {
		for (let key of __getOwnPropNames(from))
			if (!__hasOwnProp.call(to, key) && key !== except)
				__defProp(to, key, {
					get: () => from[key],
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
				});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (
	(target = mod != null ? __create(__getProtoOf(mod)) : {}),
	__copyProps(
		// If the importer is in node compatibility mode or this is not an ESM
		// file that has been converted to a CommonJS file using a Babel-
		// compatible transform (i.e. "__esModule" has not been set), then set
		// "default" to the CommonJS "module.exports" for node compatibility.
		isNodeMode || !mod || !mod.__esModule
			? __defProp(target, "default", { value: mod, enumerable: true })
			: target,
		mod,
	)
);
var __toCommonJS = (mod) =>
	__copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
	DEFAULT_COPY_ATTRS: () => DEFAULT_COPY_ATTRS,
	createSvgSpritePlugin: () => createSvgSpritePlugin,
	svgSprite: () => svgSprite,
});
module.exports = __toCommonJS(src_exports);
var import_node_path = __toESM(require("path"), 1);
var import_fs_extra = __toESM(require("fs-extra"), 1);
var import_hasha = require("hasha");
var import_svgo = __toESM(require("svgo"), 1);
var import_svgstore = __toESM(require("svgstore"), 1);
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
	let store = (0, import_svgstore.default)({
		renameDefs: true,
		copyAttrs: DEFAULT_COPY_ATTRS,
		...options.svgstoreOptions,
	});
	let icons = /* @__PURE__ */ new Map();
	let iconsAdded = /* @__PURE__ */ new Set();
	let referenceId;
	async function addIconToSprite(id, content) {
		if (!content) content = await import_fs_extra.default.readFile(id, "utf-8");
		let basename = import_node_path.default.basename(id, ".svg");
		let symbolId = options.symbolId;
		if (options.symbolId.includes("[name]")) {
			symbolId = symbolId.replace("[name]", basename);
		}
		if (options.symbolId.includes("[hash]")) {
			let contentHash = await (0, import_hasha.hash)(id);
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
		let optimized = import_svgo.default.optimize(store.toString(), {
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
		let spriteHash = await (0, import_hasha.hash)(optimized.data);
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
// Annotate the CommonJS export names for ESM import in node:
0 &&
	(module.exports = {
		DEFAULT_COPY_ATTRS,
		createSvgSpritePlugin,
		svgSprite,
	});
