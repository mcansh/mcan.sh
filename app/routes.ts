import { get, route } from "remix/routes"

export const routes = route({
  assets: get("/assets/*path"),
  home: "/",
  resume: "/resume",
  wellKnown: "/.well-known/*path",
  sitemap: "/sitemap.xml",
  manifest: "/manifest.(json|webmanifest)",
})
