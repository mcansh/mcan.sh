import path from "node:path";
import { config } from "@netlify/remix-edge-adapter";

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
export default {
  ...config,
  appDirectory: "app",
  cacheDirectory: path.join(process.cwd(), "node_modules", ".cache", "remix"),
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  server: "./server.js",
  future: {
    unstable_dev: true,
    unstable_postcss: true,
    unstable_tailwind: true,
    v2_errorBoundary: true,
    v2_meta: true,
    v2_routeConvention: true,
  },
};
