const path = require("node:path");

/** @type {import('@remix-run/dev').AppConfig}*/
module.exports = {
	ignoredRouteFiles: ["**/.*"],
	appDirectory: "app",
	assetsBuildDirectory: "public/build",
	cacheDirectory: path.join(process.cwd(), "node_modules", ".cache", "remix"),
	publicPath: "/build/",
	tailwind: true,
	postcss: true,
	serverBuildPath: "build/index.js",
	serverModuleFormat: "cjs",
	future: {
		v2_dev: true,
		v2_errorBoundary: true,
		v2_meta: true,
		v2_normalizeFormMethod: true,
		v2_routeConvention: true,
		v2_headers: true,
	},
};
