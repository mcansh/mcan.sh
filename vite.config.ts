import { vitePlugin as remix } from "@remix-run/dev";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import type { Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

let EMIT_FILE = process.env.EMIT_FILE === "true";

export default defineConfig({
	server: { middlewareMode: true },
	plugins: [
		tsconfigPaths(),
		splitVendorChunkPlugin(),
		EMIT_FILE ? visualizer({ emitFile: true }) : null,
		remix({
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
			},
		}),
	].filter((p: unknown): p is Plugin => !!p),
	build: {
		assetsInlineLimit: 0, // keep SVG as asset URL
		cssMinify: "lightningcss",
	},
});
