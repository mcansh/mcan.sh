import { svgSprite } from "@mcansh/vite-plugin-svg-sprite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import Sonda from "sonda/vite";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";

let ReactCompilerConfig = {};

export default defineConfig({
	build: { outDir: "build", cssMinify: "lightningcss", sourcemap: true },
	plugins: [
		tailwindcss(),
		svgSprite(),
		reactRouter(),
		babel({
			filter: /^app\/\.[jt]sx$/,
			loader(path) {
				if (/.tsx$/i.test(path)) return "tsx";
				return "jsx";
			},
			babelConfig: {
				presets: ["@babel/preset-typescript"],
				plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
			},
		}),
		Sonda({ open: false, detailed: true, sources: true }),
	],
});
