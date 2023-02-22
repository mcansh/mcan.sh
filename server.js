import { createRequestHandler } from "@netlify/remix-edge-adapter";
import * as build from "@remix-run/dev/server-build";

export default createRequestHandler({
  build,
  mode: process.env.NODE_ENV,
});

export const config = {
  cache: "manual",
  path: "/*",
};
