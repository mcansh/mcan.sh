import type { ServerBuild } from "@remix-run/server-runtime";
import { createRequestHandler, logDevReady } from "@remix-run/server-runtime";
import path from "node:path";
import { type Serve } from "bun";

import * as build from "./build/index.js";

let serverBuild = build as unknown as ServerBuild;

if (Bun.env.NODE_ENV === "development") logDevReady(serverBuild);

let __dirname = path.dirname(new URL(import.meta.url).pathname);

export default {
	port: Bun.env.PORT || 3000,
	async fetch(request) {
		let url = new URL(request.url);
		let publicFilePath = path.join(__dirname, "public", url.pathname);
		let file = Bun.file(publicFilePath);
		if (await file.exists()) return new Response(file);
		return createRequestHandler(serverBuild, Bun.env.NODE_ENV)(request);
	},
} satisfies Serve;
