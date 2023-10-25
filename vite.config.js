import { defineConfig } from "vite";
import { unstable_vitePlugin as remix } from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import postcss100vhFix from "postcss-100vh-fix";

import remixConfig from "./remix.config.js";

export default defineConfig({
	plugins: [tsconfigPaths(), remix({ ...remixConfig, legacyCssImports: true })],
	css: {
		postcss: [tailwindcss, autoprefixer, postcss100vhFix],
	},
});
