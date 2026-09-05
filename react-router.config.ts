import type { Config } from "@react-router/dev/config";

export default {
	ssr: true,
	splitRouteModules: "enforce",
	future: {
		unstable_optimizeDeps: true,
	},
} as Config;
