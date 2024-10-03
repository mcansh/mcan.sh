import { createSvgSpritePlugin } from "@mcansh/vite-svg-sprite-plugin";
import { vitePlugin as remix } from "@remix-run/dev";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

let SVG_SPRITE_LOGGING = process.env.RAILWAY === "true";

export default defineConfig({
	plugins: [
		createSvgSpritePlugin({ logging: SVG_SPRITE_LOGGING }),
		tailwindcss(),
		tsconfigPaths(),
		remix({
			future: {
				unstable_lazyRouteDiscovery: true,
				unstable_singleFetch: true,
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
