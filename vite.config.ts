import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { vite as million } from "million/compiler";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	server: { middlewareMode: true },
	plugins: [
		tsconfigPaths(),
		splitVendorChunkPlugin(),
		million({ auto: true, server: true }),
		// @ts-expect-error - 👀
		visualizer({ emitFile: true }),
		remix({
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
			},
		}),
	],
	build: {
		assetsInlineLimit: 0, // keep SVG as asset URL
		cssMinify: "lightningcss",
	},
});
