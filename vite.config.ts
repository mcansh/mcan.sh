import { svgSprite } from "@mcansh/vite-plugin-svg-sprite";
import { reactRouter } from "@react-router/dev/vite";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import type { Plugin } from "vite";

let EMIT_REPORT = process.env.EMIT_REPORT === "true";
let SVG_SPRITE_LOGGING = process.env.RAILWAY === "true";

export default defineConfig({
	plugins: [
		svgSprite({ logging: SVG_SPRITE_LOGGING }),
		EMIT_REPORT ? visualizer({ emitFile: true }) : null,
		reactRouter(),
	].filter((plugin: unknown): plugin is Plugin => plugin != null),
	build: { cssMinify: "lightningcss" },
});
