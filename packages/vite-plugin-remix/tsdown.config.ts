import { defineConfig } from "tsdown"

export default defineConfig({
	entry: {
		runtime: "./src/runtime.ts",
		types: "./src/types.ts",
		index: "./src/vite-plugin-remix.ts",
	},
	outDir: "./dist",
	platform: "neutral",
	dts: true,
	sourcemap: true,
	nodeProtocol: true,
	skipNodeModulesBundle: true,
	attw: { profile: "esm-only" },
	publint: true,
	format: "esm",
	exports: true,
})
