import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { vite as million } from "million/compiler";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	server: { middlewareMode: true },
	plugins: [
		remix({ future: { v3_fetcherPersist: true, v3_relativeSplatPath: true } }),
		tsconfigPaths(),
		splitVendorChunkPlugin(),
		million({ auto: true, server: true }),
	],
	build: {
		assetsInlineLimit: 0, // keep SVG as asset URL
		cssMinify: "lightningcss",
	},
});
