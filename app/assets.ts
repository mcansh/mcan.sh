import os from "node:os"
import path from "node:path"

import { createAssetServer } from "remix/assets"
import { loadConfig } from "remix/cli"
import { createFsFileStorage } from "remix/file-storage/fs"
import { uiHmr } from "remix/ui-hmr/assets"

const nodeEnv = process.env.NODE_ENV ?? "development"
const isDevelopment = nodeEnv === "development"
const isProduction = nodeEnv === "production"
const isHmr = Boolean(isDevelopment && process.env.REMIX_NODE_HMR)
const config = await loadConfig(import.meta.dirname)
if (!config.assets) throw new Error("Missing assets configuration")
if (!config.assets.files) throw new Error("Missing asset file configuration")
const rootDir = config.assets.rootDir

const fileCacheKey = process.env.RAILWAY_DEPLOYMENT_ID ?? `process-${process.pid}`

export const assets = createAssetServer({
  ...config.assets,
  rootDir,

  sourceMaps: isDevelopment ? "external" : undefined,
  minify: isProduction,
  watch: isDevelopment,
  hmr: isHmr
    ? {
        channel: createAppBrowserHmrChannel,
        moduleImporter: "remix/multiple-import-maps-polyfill",
      }
    : undefined,
  scripts: {
    loaders: isHmr ? [uiHmr()] : undefined,
    define: {
      "process.env.NODE_ENV": JSON.stringify(nodeEnv),
    },
  },
  fingerprint: isProduction,
  files: {
    ...config.assets.files,
    cache: createFsFileStorage(path.join(os.tmpdir(), "remix-website-assets")),
    cacheKey: fileCacheKey,
    maxRequestTransforms: 1,
  },
})

async function createAppBrowserHmrChannel() {
  let nodeHmr = await import("remix/node-hmr/runtime")
  let channel = await nodeHmr.createBrowserHmrChannel()
  return channel
}
