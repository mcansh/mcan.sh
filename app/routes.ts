import type { RouteConfig } from "@react-router/dev/routes";
import { index, route } from "@react-router/dev/routes";

export default [
	index("./routes/_index.tsx"),
	route("/.well-known/*", "./routes/well-known.$.ts"),
	route("/resume", "./routes/resume.tsx"),
	route("/resume.pdf", "./routes/resume.pdf.ts"),
	route("/manifest.webmanifest", "./routes/manifest.webmanifest/index.ts"),
] satisfies RouteConfig;
