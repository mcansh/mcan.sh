import defaultTheme from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";
import tailwindcssPaddingSafe from "tailwindcss-padding-safe";

export default {
	content: ["app/**/*.{ts,tsx,js,jsx}"],
	darkMode: "media",
	theme: {
		extend: {
			screens: {
				print: { raw: "print" },
				"media-fullscreen": {
					raw: "(display-mode: fullscreen)",
				},
				"media-standalone": {
					raw: "(display-mode: standalone)",
				},
				"media-minimal-ui": {
					raw: "(display-mode: minimal-ui)",
				},
				"media-browser": {
					raw: "(display-mode: browser)",
				},
				"media-window-controls-overlay": {
					raw: "(display-mode: window-controls-overlay)",
				},
			},
			colors: {
				blue: {
					screen: "#1000f2",
				},
			},
			fontFamily: {
				sans: ["Inter var", ...defaultTheme.fontFamily.sans],
				mono: ["Berkeley Mono", ...defaultTheme.fontFamily.mono],
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [tailwindcssPaddingSafe],
} satisfies Config;
