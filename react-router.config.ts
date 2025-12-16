import type { Config } from "@react-router/dev/config";

export default {
	ssr: true,
	future: {
		unstable_optimizeDeps: true,
		v8_middleware: true,
		v8_splitRouteModules: "enforce",
		v8_viteEnvironmentApi: true,
	},
} as Config;
