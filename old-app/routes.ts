import type { RouteConfig } from "@react-router/dev/routes"
import { index, route } from "@react-router/dev/routes"

export default [
  index("./routes/home.tsx"),
  route("/.well-known/*", "./routes/well-known.$.ts"),
  route("/resume", "./routes/resume/route.tsx"),
  route("/sitemap.xml", "./routes/sitemap[.]xml.ts"),
  route("/manifest.webmanifest", "./routes/manifest.webmanifest/index.ts"),
] satisfies RouteConfig
