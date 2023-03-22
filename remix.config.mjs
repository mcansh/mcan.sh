import path from "node:path";

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
export default {
  ignoredRouteFiles: ["**/.*"],
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  cacheDirectory: path.join(process.cwd(), "node_modules", ".cache", "remix"),
  publicPath: "/build/",
  serverBuildPath: "build/index.js",
  future: {
    unstable_cssModules: true,
    unstable_cssSideEffectImports: true,
    unstable_dev: true,
    unstable_postcss: true,
    unstable_tailwind: true,
    unstable_vanillaExtract: true,
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
};
