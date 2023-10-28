/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import crypto from "node:crypto";
import type {
	AppLoadContext,
	EntryContext,
	HandleDataRequestFunction,
} from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { createSecureHeaders } from "@mcansh/http-helmet";
import isbot from "isbot";
import { renderToReadableStream } from "react-dom/server";
import { isPrefetch } from "remix-utils/is-prefetch";
import { preloadRouteAssets } from "remix-utils/preload-route-assets";

import { NonceContext } from "./components/nonce";
import { env } from "./env.server";

const ABORT_DELAY = 5_000;

export default async function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext,
	loadContext: AppLoadContext,
) {
	preloadRouteAssets(remixContext, responseHeaders);

	let nonce = applySecurityHeaders(responseHeaders);

	let stream = await renderToReadableStream(
		<NonceContext.Provider value={nonce}>
			<RemixServer
				context={remixContext}
				url={request.url}
				abortDelay={ABORT_DELAY}
			/>
		</NonceContext.Provider>,
		{
			nonce,
			onError(error, errorInfo) {
				// log streaming render errors from inside the shell
				console.error(error, errorInfo);
				responseStatusCode = 500;
			},
		},
	);

	if (isbot(request.headers.get("user-agent"))) {
		await stream.allReady;
	}

	responseHeaders.set("Content-Type", "text/html");
	return new Response(stream, {
		status: responseStatusCode,
		headers: responseHeaders,
	});
}

export let handleDataRequest: HandleDataRequestFunction = async (
	response,
	{ request },
) => {
	// if it's a GET request and it's a prefetch request
	// and it doesn't already have a Cache-Control header
	// we will cache for 10 seconds only on the browser
	if (
		request.method.toLowerCase() === "get" &&
		isPrefetch(request) &&
		!response.headers.has("Cache-Control")
	) {
		response.headers.set("Cache-Control", "private, max-age=10");
	}

	applySecurityHeaders(response.headers);

	return response;
};

function applySecurityHeaders(responseHeaders: Headers) {
	if (process.env.NODE_ENV === "development") {
		responseHeaders.set("Cache-Control", "no-cache");
	}

	let nonce = crypto.randomBytes(16).toString("base64");
	let securityHeaders = createSecureHeaders({
		"Content-Security-Policy": {
			upgradeInsecureRequests: process.env.NODE_ENV === "production",
			baseUri: ["'self'"],
			defaultSrc: ["'none'"],
			fontSrc: ["'self'"],
			imgSrc: [
				"'self'",
				"https://res.cloudinary.com/dof0zryca/image/upload/",
				"https://thirtyseven-active.b-cdn.net",
			],
			scriptSrc: [
				"'self'",
				"https://thirtyseven-active.b-cdn.net/script.js",
				`'nonce-${nonce}'`,
			],
			styleSrc: ["'self'"],
			manifestSrc: ["'self'"],
			prefetchSrc: ["'self'"],
			connectSrc: [
				...(process.env.NODE_ENV === "production"
					? ["'self'"]
					: ["'self'", "ws:"]),
			],
			workerSrc: ["blob:"],
			reportUri: [env.SENTRY_REPORT_URL],
		},
		"Referrer-Policy": "origin-when-cross-origin",
		"X-Frame-Options": "DENY",
		"X-Content-Type-Options": "nosniff",
		"X-DNS-Prefetch-Control": "on",
		"X-XSS-Protection": "1; mode=block",
		"Strict-Transport-Security": {
			maxAge: 31536000,
			includeSubDomains: true,
			preload: true,
		},
		"Permissions-Policy": {
			accelerometer: [],
			"ambient-light-sensor": [],
			autoplay: [],
			battery: [],
			camera: [],
			"display-capture": [],
			"document-domain": [],
			"encrypted-media": [],
			"execution-while-not-rendered": [],
			"execution-while-out-of-viewport": [],
			fullscreen: [],
			gamepad: [],
			geolocation: [],
			gyroscope: [],
			"layout-animations": [],
			"legacy-image-formats": [],
			magnetometer: [],
			microphone: [],
			midi: [],
			"navigation-override": [],
			"oversized-images": [],
			payment: [],
			"picture-in-picture": [],
			"publickey-credentials-get": [],
			"speaker-selection": [],
			"sync-xhr": [],
			"unoptimized-images": [],
			"unsized-media": [],
			usb: [],
			"screen-wake-lock": [],
			"web-share": [],
			"xr-spatial-tracking": [],
		},
		"Cross-Origin-Opener-Policy": "same-origin",
	});

	for (let header of securityHeaders) {
		responseHeaders.set(...header);
	}

	let permissionsPolicy = securityHeaders.get("Permissions-Policy");

	if (permissionsPolicy) {
		responseHeaders.set("Feature-Policy", permissionsPolicy);
	}

	responseHeaders.set(`Expect-CT`, `report-uri="${env.SENTRY_REPORT_URL}"`);

	return nonce;
}
