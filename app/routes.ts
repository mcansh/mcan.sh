import { index, route } from "@react-router/dev/routes";
import type { RouteConfig } from "@react-router/dev/routes";

export const routes = [
	index("./routes/_index.tsx"),
	route("/.well-known/*", "./routes/[.well-known].$.ts"),
	route("/resume", "./routes/resume.tsx"),
	route("/resume.pdf", "./routes/resume[.pdf].ts"),
	route("/manifest.webmanifest", "./routes/manifest[.webmanifest].ts"),
] satisfies RouteConfig;
