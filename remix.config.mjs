import path from "node:path";

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
export default {
  appDirectory: "app",
  cacheDirectory: path.join(process.cwd(), "node_modules", ".cache", "remix"),
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  server: "./server.js",
  serverBuildPath: ".netlify/functions-internal/server.js",
  future: {
    unstable_dev: true,
    unstable_postcss: true,
    unstable_tailwind: true,
    v2_errorBoundary: true,
    v2_meta: true,
    v2_routeConvention: true,
  },
};
