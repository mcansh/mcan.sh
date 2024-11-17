import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import tailwindcssPaddingSafe from "tailwindcss-padding-safe";

import { linkColor } from "./app/routes/manifest[.webmanifest]";

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
				link: linkColor,
			},
			fontFamily: {
				sans: ["Berkeley Mono", ...defaultTheme.fontFamily.sans],
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [tailwindcssPaddingSafe],
} satisfies Config;
