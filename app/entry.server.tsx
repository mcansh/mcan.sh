import { PassThrough } from "node:stream";
import type { EntryContext, HandleDataRequestFunction } from "@remix-run/node";
import { Response, redirect } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { createSecureHeaders } from "@mcansh/remix-secure-headers";
import { renderToPipeableStream } from "react-dom/server";
import { isPrefetch, preloadRouteAssets } from "remix-utils";
import isbot from "isbot";

const ABORT_DELAY = 5_000;

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

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  let url = new URL(request.url);
  if (url.hostname === "resume.mcan.sh") {
    return redirect("https://mcan.sh/resume");
  }

  let callback = isbot(request.headers.get("user-agent"))
    ? "onAllReady"
    : "onShellReady";

  preloadRouteAssets(remixContext, responseHeaders);

  return new Promise((resolve, reject) => {
    let { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        [callback]() {
          let body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");

          if (process.env.NODE_ENV === "development") {
            responseHeaders.set("Cache-Control", "no-cache");
          }

          for (let header of securityHeaders) {
            responseHeaders.set(...header);
          }

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          console.error(error);
          responseStatusCode = 500;
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
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

  if (process.env.NODE_ENV === "development") {
    response.headers.set("Cache-Control", "no-cache");
  }

  for (let header of securityHeaders) {
    response.headers.set(...header);
  }

  return response;
};
