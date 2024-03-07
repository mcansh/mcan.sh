import { createSvgSpritePlugin } from "@mcansh/vite-svg-sprite-plugin";
import { vitePlugin as remix } from "@remix-run/dev";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import type { Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

let EMIT_REPORT = process.env.EMIT_REPORT === "true";
let SVG_SPRITE_LOGGING = process.env.RAILWAY === "true";

export default defineConfig({
	plugins: [
		createSvgSpritePlugin({ logging: SVG_SPRITE_LOGGING }),
		tailwindcss(),
		tsconfigPaths(),
		EMIT_REPORT ? visualizer({ emitFile: true }) : null,
		remix({
			future: {
				unstable_lazyRouteDiscovery: true,
				unstable_singleFetch: true,
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
			},
		}),
	].filter((plugin: unknown): plugin is Plugin => plugin != null),
	build: { cssMinify: "lightningcss" },
});
