import { get, route } from "remix/routes"

export const routes = route({
  assets: get("/assets/*path"),
  home: get("/"),
  preview: get("/preview"),
  resume: get("/resume"),
  wellKnownAvatar: get("/.well-known(/*path)/avatar"),
  sitemap: get("/sitemap.xml"),
  manifest: get("/manifest.:ext"),
})
