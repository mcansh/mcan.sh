import { createSvgSpritePlugin } from "@mcansh/vite-svg-sprite-plugin";
import { vitePlugin as remix } from "@remix-run/dev";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import type { Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

let EMIT_REPORT = process.env.EMIT_REPORT === "true";

export default defineConfig({
	server: { middlewareMode: true },
	plugins: [
		createSvgSpritePlugin(),
		tsconfigPaths(),
		EMIT_REPORT ? visualizer({ emitFile: true }) : null,
		remix({
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
			},
		}),
	].filter((p: unknown): p is Plugin => !!p),
	build: {
		cssMinify: "lightningcss",
	},
});
