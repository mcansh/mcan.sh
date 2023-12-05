import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
	server: { middlewareMode: true },
	plugins: [remix({ future: { v3_fetcherPersist: true } }), tsconfigPaths()],
});
