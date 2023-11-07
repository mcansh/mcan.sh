import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	// @ts-expect-error - tsconfigPaths is having a type issue
	plugins: [remix(), tsconfigPaths()],
});
