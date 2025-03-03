import type { RouteConfig } from "@react-router/dev/routes";
import { index, route } from "@react-router/dev/routes";

export default [
	index("./routes/home.tsx"),
	route("/.well-known/*", "./routes/well-known.$.ts"),
	route("/resume", "./routes/resume.tsx"),
	route("/manifest.webmanifest", "./routes/manifest.webmanifest/index.ts"),
    route("/sitemap.xml", "./routes/sitemap.ts"),
] satisfies RouteConfig;
