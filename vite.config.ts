import { svgSprite } from "@mcansh/vite-plugin-svg-sprite";
import { vitePlugin as remix } from "@remix-run/dev";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import type { Plugin } from "vite";

let EMIT_REPORT = process.env.EMIT_REPORT === "true";
let SVG_SPRITE_LOGGING = process.env.RAILWAY === "true";

console.log({ SVG_SPRITE_LOGGING });

declare module "@remix-run/node" {
	interface Future {
		v3_singleFetch: true;
	}
}

export default defineConfig({
	plugins: [
		svgSprite({ logging: SVG_SPRITE_LOGGING }),
		EMIT_REPORT ? visualizer({ emitFile: true }) : null,
		remix({
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
				v3_singleFetch: true,
				v3_lazyRouteDiscovery: true,
				unstable_optimizeDeps: true,
			},
		}),
	].filter((plugin: unknown): plugin is Plugin => plugin != null),
	build: { cssMinify: "lightningcss" },
});
