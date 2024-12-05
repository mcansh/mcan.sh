import { svgSprite } from "@mcansh/vite-plugin-svg-sprite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";

const ReactCompilerConfig = {
	target: "18", // '17' | '18' | '19'
};

export default defineConfig({
	build: { cssMinify: "lightningcss" },
	plugins: [
		tailwindcss(),
		svgSprite(),
		reactRouter(),
		babel({
			filter: /\.[jt]sx?$/,
			loader(path) {
				if (/.ts$/i.test(path)) return "tsx";
				if (/.tsx$/i.test(path)) return "tsx";
				return "js";
			},
			babelConfig: {
				presets: ["@babel/preset-typescript"],
				plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
			},
		}),
	],
});
