import path from "node:path";

/** @type {import('@remix-run/dev').AppConfig}*/
export default {
  ignoredRouteFiles: ["**/.*"],
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  cacheDirectory: path.join(process.cwd(), "node_modules", ".cache", "remix"),
  publicPath: "/build/",
  tailwind: true,
  postcss: true,
  serverBuildPath: "build/index.js",
  serverModuleFormat: "esm",
  future: {
    unstable_dev: true,
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
};
