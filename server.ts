import type { ServerBuild } from "@remix-run/server-runtime";
import { createRequestHandler, logDevReady } from "@remix-run/server-runtime";
import path from "node:path";
import fs from "node:fs";

// @ts-expect-error - ServerBuild
import * as build from "./build/index.js";

let serverBuild = build as unknown as ServerBuild;

let NODE_ENV = Bun.env.NODE_ENV || "production";

if (NODE_ENV === "development") logDevReady(serverBuild);

let __dirname = import.meta.dir;

let server = Bun.serve({
	development: NODE_ENV === "development",
	port: Bun.env.PORT || 3000,
	async fetch(request) {
		let url = new URL(request.url);
		let publicFilePath = path.join(__dirname, "public", url.pathname);

		let file = fs.statSync(publicFilePath);

		if (file.isFile()) {
			let bunFile = Bun.file(publicFilePath);
			return new Response(bunFile);
		}

		if (file.isDirectory() && url.pathname !== "/") {
			return new Response(null, { status: 400 });
		}

		return createRequestHandler(serverBuild, NODE_ENV)(request);
	},
});

console.log(`✅ app ready: http://${server.hostname}:${server.port}`);
