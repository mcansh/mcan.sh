import path from "node:path";

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
export default {
  cacheDirectory: path.join(process.cwd(), "node_modules", ".cache", "remix"),
  serverBuildTarget: "vercel",
  appDirectory: "app",
  browserBuildDirectory: "public/build",
  publicPath: "/build/",
  // When running locally in development mode, we use the built in remix
  // server. This does not understand the vercel lambda module format,
  // so we default back to the standard build output.
  server: process.env.NODE_ENV === "development" ? undefined : "./server.js",
};
