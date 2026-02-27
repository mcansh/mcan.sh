import { get, route } from "remix/fetch-router/routes"

export let routes = route({
	home: get("/"),
	wellKnown: get(".well-known/*path"),
	resume: get("resume"),
	sitemap: get("sitemap.xml"),
	manifest: get("manifest.webmanifest"),
})
