import { svgSprite } from "@mcansh/vite-plugin-svg-sprite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import type { FontaineTransformOptions } from "fontaine";
import { FontaineTransform } from "fontaine";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";

let ReactCompilerConfig = {};

let options = {
	fallbacks: [
		"ui-sans-serif",
		"system-ui",
		"sans-serif",
		"Apple Color Emoji",
		"Segoe UI Emoji",
		"Segoe UI Symbol",
		"Noto Color Emoji",
	],
	// You may need to resolve assets like `/fonts/Roboto.woff2` to a particular directory
	resolvePath: (id) => {
		console.log({ id });
		return `file:///path/to/public/dir${id}`;
	},
	// overrideName: (originalName) => `${name} override`
	// sourcemap: false
	// skipFontFaceGeneration: (fallbackName) => fallbackName === 'Roboto override'
} satisfies FontaineTransformOptions;

export default defineConfig({
	build: { cssMinify: "lightningcss" },
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
		FontaineTransform.vite(options),
	],
});
