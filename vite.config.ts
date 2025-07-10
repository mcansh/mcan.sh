import { cloudflare } from "@cloudflare/vite-plugin";
import { svgSprite } from "@mcansh/vite-plugin-svg-sprite";
import { reactRouter } from "@react-router/dev/vite";
import reactScan from "@react-scan/vite-plugin-react-scan";
import tailwindcss from "@tailwindcss/vite";
import Sonda from "sonda/vite";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";

let ReactCompilerConfig = {};

export default defineConfig({
	build: { outDir: "build", cssMinify: "lightningcss", sourcemap: true },
	plugins: [
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		tailwindcss(),
		svgSprite(),
		reactRouter(),
		babel({
			filter: /^app\/\.[jt]sx$/,
			loader(path) {
				if (/.ts$/i.test(path)) return "ts";
				if (/.tsx$/i.test(path)) return "tsx";
				if (/.jsx$/i.test(path)) return "jsx";
				return "js";
			},
			babelConfig: {
				presets: ["@babel/preset-typescript"],
				plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
			},
		}),
		Sonda({
			open: false,
			sources: true,
			deep: true,
		}),
		reactScan(),
	],
});
