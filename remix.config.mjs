import path from "node:path";

export const cacheDirectory = path.join(
  process.cwd(),
  "node_modules",
  ".cache",
  "remix"
);

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
export default {
  cacheDirectory,
  serverBuildTarget: "vercel",
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildDirectory: "build",
  future: {
    v2_meta: true,
    v2_routeConvention: true,
    v2_errorBoundary: true,
  },
};
