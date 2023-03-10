import type {
  EntryContext,
  HandleDataRequestFunction,
} from "@netlify/remix-runtime";
import { RemixServer } from "@remix-run/react";
import { createSecureHeaders } from "@mcansh/remix-secure-headers";
import { renderToReadableStream } from "react-dom/server";
import { isPrefetch, preloadRouteAssets } from "remix-utils";
import isbot from "isbot";

const securityHeaders = createSecureHeaders({
  "Content-Security-Policy": {
    defaultSrc: ["'none'"],
    fontSrc: ["'self'"],
    imgSrc: [
      "'self'",
      "https://res.cloudinary.com/dof0zryca/image/upload/",
      "https://thirtyseven-active.b-cdn.net",
    ],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      "https://thirtyseven-active.b-cdn.net/script.js",
    ],
    styleSrc: ["'self'", "'unsafe-inline'"],
    manifestSrc: ["'self'"],
    prefetchSrc: ["'self'"],
    connectSrc: [
      "'self'",
      ...(process.env.NODE_ENV === "development"
        ? [`ws://localhost:3001`]
        : []),
    ],
  },
  "Referrer-Policy": "origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "X-DNS-Prefetch-Control": "on",
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

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  preloadRouteAssets(remixContext, responseHeaders);

  let body = await renderToReadableStream(
    <RemixServer context={remixContext} url={request.url} />,
    {
      onError(error) {
        responseStatusCode = 500;
        console.error(error);
      },
    }
  );

  if (isbot(request.headers.get("user-agent"))) {
    await body.allReady;
  }

  responseHeaders.set("Content-Type", "text/html");

  applySecurityHeaders(responseHeaders);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

export const handleDataRequest: HandleDataRequestFunction = async (
  response,
  { request }
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

  for (let header of securityHeaders) {
    responseHeaders.set(...header);
  }
}
