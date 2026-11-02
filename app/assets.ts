import { createAssetResolver } from "pitlane/assets"
import { createAssetManifest } from "pitlane/assets/build"
import viteManifest from "pitlane/assets/manifest"

function testManifest() {
  return createAssetManifest({
    base: "/",
    importMap: { imports: { "test:entry": "/test-entry.js" } },
    environments: {
      client: {
        role: "client",
        chunks: {
          entry: {
            file: "test-entry.js",
            modules: ["app/actions/public/entry.ts"],
            imports: [],
            dynamicImports: [],
            stylesheets: ["test-global.css"],
          },
        },
        entries: { "app/actions/public/entry.ts": "entry" },
        assets: { "app/actions/public/global.css": "test-global.css" },
      },
      ssr: {
        role: "server",
        chunks: {
          server: {
            file: "ssr.js",
            modules: ["app/entry.server.tsx"],
            imports: [],
            dynamicImports: [],
            stylesheets: [],
          },
        },
        entries: {},
        assets: {},
      },
    },
  })
}

export const assets = createAssetResolver(
  viteManifest.mode === "unavailable" ? testManifest() : viteManifest,
)
export const scriptEntry = await assets.getScriptEntry("app/actions/public/entry.ts")
export const stylesheetHref = await assets.getHref("app/actions/public/global.css")
