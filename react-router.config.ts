import type { Config } from "@react-router/dev/config";

export default {
	ssr: true,
	future: {
		unstable_optimizeDeps: true,
		unstable_splitRouteModules: true,
		// unstable_viteEnvironmentApi: true,
	},
} as Config;
