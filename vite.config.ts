import { cloudflare } from "@cloudflare/vite-plugin"
import { remix } from "pitlane/vite-plugin-remix"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => ({
  define: {
    "import.meta.env.SENTRY_DSN": JSON.stringify(
      loadEnv(mode, process.cwd(), "SENTRY_DSN").SENTRY_DSN || "",
    ),
  },
  plugins: [
    remix({
      serverHandler: false,
      clientEntry: "app/actions/public/entry.ts",
      serverEntry: "app/entry.server.tsx",
    }),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
  ],
  server: { port: 44100 },
}))
