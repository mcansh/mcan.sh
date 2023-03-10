import path from "node:path";

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
export default {
  appDirectory: "app",
  cacheDirectory: path.join(process.cwd(), "node_modules", ".cache", "remix"),
  serverBuildPath: "build/index.js",
  serverConditions: ["deno", "worker"],
  serverDependenciesToBundle: "all",
  serverMainFields: ["module", "main"],
  serverModuleFormat: "esm",
  serverPlatform: "neutral",
  server: "./server.js",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  future: {
    unstable_dev: true,
    unstable_postcss: true,
    unstable_tailwind: true,
    v2_errorBoundary: true,
    v2_meta: true,
    v2_routeConvention: true,
  },
};
