import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	server: { middlewareMode: true },
	plugins: [remix({ future: { v3_fetcherPersist: true } }), tsconfigPaths()],
	build: {
		assetsInlineLimit: 0, // keep SVG as asset URL
	},
});
