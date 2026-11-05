import { cloudflare } from "@cloudflare/vite-plugin"
import { remix } from "pitlane/vite-plugin-remix"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    remix({
      serverHandler: false,
      clientEntry: "app/actions/public/entry.ts",
      serverEntry: "app/entry.server.tsx",
    }),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
  ],
  server: { port: 44100 },
})
