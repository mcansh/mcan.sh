import path from "node:path";

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
export default {
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  cacheDirectory: path.join(process.cwd(), "node_modules", ".cache", "remix"),
  publicPath: "/build/",
  serverBuildPath: "api/index.js",
  future: {
    v2_meta: true,
    v2_routeConvention: true,
    v2_errorBoundary: true,
    unstable_tailwind: true,
    unstable_postcss: true,
  },
};
