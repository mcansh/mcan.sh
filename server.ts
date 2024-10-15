import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
import { createRequestHandler } from "@remix-run/cloudflare";
import type { ServerBuild } from "@remix-run/cloudflare";
// eslint-disable-next-line import/no-unresolved
import __STATIC_CONTENT_MANIFEST from "__STATIC_CONTENT_MANIFEST";

import { envSchema } from "./app/.server/env.js";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - this file wont exist until after the build
import * as build from "./build/server";

const MANIFEST = JSON.parse(__STATIC_CONTENT_MANIFEST);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleRemixRequest = createRequestHandler(build as any as ServerBuild);

export default {
	async fetch(request, env, ctx) {
		let waitUntil = ctx.waitUntil.bind(ctx);
		let passThroughOnException = ctx.passThroughOnException.bind(ctx);
		try {
			let url = new URL(request.url);
			let ttl = url.pathname.startsWith("/assets/")
				? 60 * 60 * 24 * 365 // 1 year
				: 60 * 5; // 5 minutes
			return await getAssetFromKV(
				// @ts-expect-error - hush
				{ request, waitUntil },
				{
					ASSET_NAMESPACE: env.__STATIC_CONTENT,
					ASSET_MANIFEST: MANIFEST,
					cacheControl: {
						browserTTL: ttl,
						edgeTTL: ttl,
					},
				},
			);
		} catch {
			// No-op
		}

		try {
			let result = envSchema.parse(env);
			let loadContext = {
				cloudflare: {
					// This object matches the return value from Wrangler's
					// `getPlatformProxy` used during development via Remix's
					// `cloudflareDevProxyVitePlugin`:
					// https://developers.cloudflare.com/workers/wrangler/api/#getplatformproxy
					cf: request.cf,
					ctx: { waitUntil, passThroughOnException },
					caches,
					env: env,
				},
				env: result,
			};

			// @ts-expect-error - hush
			return await handleRemixRequest(request, loadContext);
		} catch (error) {
			console.log(error);
			return new Response("An unexpected error occurred", { status: 500 });
		}
	},
} satisfies ExportedHandler<Env & { __STATIC_CONTENT: KVNamespace<string> }>;
