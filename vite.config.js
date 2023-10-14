import { defineConfig } from "vite";
import { unstable_vitePlugin as remix } from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";

import remixConfig from "./remix.config.js";

export default defineConfig({
	plugins: [tsconfigPaths(), remix(remixConfig)],
});
