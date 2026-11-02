import { bindings, defineConfig } from "cf/config"

export default defineConfig({
  worker: {
    name: "mcan-sh",
    entrypoint: "./app/entry.server.tsx",
    compatibilityDate: "2026-10-19",
    compatibilityFlags: ["nodejs_compat"],
    observability: {
      enabled: true,
      logs: { enabled: true },
      traces: { enabled: true },
    },
    env: {
      CLOUDINARY_CLOUD_NAME: bindings.secret(),
      SENTRY_REPORT_URL: bindings.secret(),
    },
  },
})
