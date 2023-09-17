import * as Bun from "bun";
import fs from "node:fs";
import {
	broadcastDevReady,
	createRequestHandler,
} from "@remix-run/server-runtime";
import type { ServerBuild } from "@remix-run/node";
import { cacheHeader } from "pretty-cache-header";

const BUILD_PATH = "./build/index.js";
const STATIC_PATH = "./public";
const STATIC_BUILD_PATH = "/build/";

let build: ServerBuild = await import(BUILD_PATH);

if (build.mode === "development") broadcastDevReady(build);

let server = Bun.serve({
	port: Bun.env.PORT || 3000,
	async fetch(request) {
		let url = new URL(request.url);

		try {
			let filePath = STATIC_PATH + url.pathname;
			if (fs.statSync(filePath).isFile()) {
				let file = Bun.file(filePath);

				let cacheControl: string;

				if (url.pathname.startsWith(STATIC_BUILD_PATH)) {
					cacheControl = cacheHeader({
						immutable: true,
						maxAge: "1y",
						public: true,
						sMaxage: "1y",
					});
				} else {
					cacheControl = cacheHeader({
						maxAge: "1h",
						sMaxage: "1h",
						public: true,
					});
				}
				return new Response(file, {
					headers: { "Cache-Control": cacheControl },
				});
			}
		} catch {}

		build = await import(BUILD_PATH);
		let handler = createRequestHandler(build, build.mode);

		let loadContext = {};

		let response = await handler(request, loadContext);
		return new Response(response.body, {
			status: response.status,
			headers: response.headers,
		});
	},
	error() {
		return new Response(null, { status: 404 });
	},
});

console.log(`✅ app ready: http://${server.hostname}:${server.port}`);
