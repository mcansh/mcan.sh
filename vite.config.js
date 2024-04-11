import { createSvgSpritePlugin } from "@mcansh/vite-svg-sprite-plugin";
import { vitePlugin as remix } from "@remix-run/dev";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

let EMIT_REPORT = process.env.EMIT_REPORT === "true";
let SVG_SPRITE_LOGGING = process.env.RAILWAY === "true";

export default defineConfig({
	server: { middlewareMode: true },
	plugins: [
		createSvgSpritePlugin({ logging: SVG_SPRITE_LOGGING }),
		tsconfigPaths(),
		EMIT_REPORT ? visualizer({ emitFile: true }) : null,
		remix({
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
			},
		}),
	],
	build: { cssMinify: "lightningcss" },
});
