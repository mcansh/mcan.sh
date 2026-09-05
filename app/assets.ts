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

const buildId = isProduction ? getBuildId() : undefined

export const assets = createAssetServer({
  basePath: "/assets",
  rootDir,

  allowFiles: ["app/routes.ts", "app/**/public/**"],
  allowPackages: ["remix"],
  denyFiles: ["app/**/*.test.*"],
  sourceMaps: isDevelopment ? "external" : undefined,
  minify: !isDevelopment,
  watch: isDevelopment,
  hmr: isHmr ? createAppBrowserHmrChannel : undefined,
  scripts: {
    loaders: isHmr ? [uiHmr()] : undefined,
    define: {
      "process.env.NODE_ENV": JSON.stringify(nodeEnv),
    },
  },
  files: {
    ...config.assets.files,
    cache: createFsFileStorage(
      path.join(
        os.tmpdir(),
        "remix-website-assets",
        buildId ? Buffer.from(buildId).toString("base64url") : `process-${process.pid}`,
      ),
    ),
    maxRequestTransforms: 1,
    // transforms: webpTransforms,
  },
})

async function createAppBrowserHmrChannel() {
  let nodeHmr = await import("remix/node-hmr/runtime")
  let channel = await nodeHmr.createBrowserHmrChannel()
  return channel
}

function getBuildId() {
  let buildId = process.env.ASSET_BUILD_ID || process.env.RAILWAY_DEPLOYMENT_ID
  if (!buildId) {
    throw new Error(
      "ASSET_BUILD_ID or RAILWAY_DEPLOYMENT_ID is required for production asset fingerprinting",
    )
  }
  return buildId
}

const publicPath = path.resolve(import.meta.dirname, "./actions/public")

const fontEntries = {
  berkeleyMono: path.resolve(publicPath, "./fonts/berkeley-mono-variable-regular.woff2"),
} as const

type FontName = keyof typeof fontEntries

type FontAsset = {
  href: string
}

const defaultEntry = path.resolve(publicPath, "entry.ts")
const globalCss = path.resolve(publicPath, "global.css")

export const entryHref = await assets.getHref(defaultEntry)
export const entryPreloads = await assets.getPreloads(defaultEntry)
export const globalCssHref = await assets.getHref(globalCss)
export const globalCssPreloads = await assets.getPreloads(globalCss)

export const fonts = await Promise.all(
  Object.entries(fontEntries).map(async ([name, fontEntry]) => {
    let href = await assets.getHref(fontEntry)
    return [name, { href }] as const
  }),
).then((entries) => Object.fromEntries(entries) as Record<FontName, FontAsset>)
