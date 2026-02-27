import { cloudflare } from "@cloudflare/vite-plugin"
import { remix } from "@jacob-ebey/vite-plugin-remix"
import { svgSprite } from "@mcansh/vite-plugin-svg-sprite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

export default defineConfig({
	server: { port: 44100 },
	environments: {
		client: {
			build: {
				rollupOptions: {
					input: "app/entry.browser",
				},
			},
		},
	},
	build: { target: "es2023", cssTarget: "es2023", outDir: "build" },
	plugins: [
		remix({ serverHandler: false }),
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		tailwindcss(),
		svgSprite(),
	],
})
