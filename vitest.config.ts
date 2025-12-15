import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
		css: true,
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "json-summary", "html"],
			exclude: [
				"node_modules/",
				"build/",
				"*.config.{js,ts}",
				"**/*.d.ts",
				"**/types/**",
			],
		},
	},
	resolve: {
		alias: {
			"#app": fileURLToPath(new URL("./app", import.meta.url)),
		},
	},
});
