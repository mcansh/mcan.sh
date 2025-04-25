import { cloudflare } from "@cloudflare/vite-plugin";
import { svgSprite } from "@mcansh/vite-plugin-svg-sprite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import type { FontaineTransformOptions } from "fontaine";
import { FontaineTransform } from "fontaine";
import Sonda from "sonda/vite";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import pkgJson from "./package.json";

let ReactCompilerConfig = {
	target: pkgJson.dependencies.react.split(".").at(0),
};

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
		Sonda({ open: false, sources: true, deep: true, server: true }),
		FontaineTransform.vite(options),
	],
});
