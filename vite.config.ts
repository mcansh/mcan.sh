import { createSvgSpritePlugin } from "@mcansh/vite-svg-sprite-plugin";
import {
	cloudflareDevProxyVitePlugin,
	vitePlugin as remix,
} from "@remix-run/dev";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import type { Plugin } from "vite";

let EMIT_REPORT = process.env.EMIT_REPORT === "true";

declare module "@remix-run/cloudflare" {
	interface Future {
		unstable_singleFetch: true;
	}
}

export default defineConfig({
	plugins: [
		cloudflareDevProxyVitePlugin(),
		createSvgSpritePlugin(),
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
	build: { cssMinify: "lightningcss", minify: true },
	ssr: {
		resolve: {
			conditions: ["workerd", "worker", "browser"],
		},
	},
	resolve: {
		mainFields: ["browser", "module", "main"],
	},
});
