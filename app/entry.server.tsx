import type { EntryContext, HandleDataRequestFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { createSecureHeaders } from "@mcansh/remix-secure-headers";
import { renderToString } from "react-dom/server";
import etag from "etag";

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
        ? [`ws://localhost:${process.env.REMIX_DEV_SERVER_WS_PORT}`]
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

export default function handleDocumentRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  let url = new URL(request.url);
  if (url.hostname === "resume.mcan.sh") {
    return redirect("https://mcan.sh/resume");
  }

  let markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set("Content-Type", "text/html");

  if (process.env.NODE_ENV === "development") {
    responseHeaders.set("Cache-Control", "no-cache");
  }

  for (let header of securityHeaders) {
    responseHeaders.set(...header);
  }

  responseHeaders.set("ETag", etag(markup));

  if (request.headers.get("If-None-Match") === responseHeaders.get("ETag")) {
    return new Response("", { status: 304, headers: responseHeaders });
  }

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}

export const handleDataRequest: HandleDataRequestFunction = async (
  response,
  { request }
) => {
  let clonedResponse = response.clone();
  let isGet = request.method.toLowerCase() === "get";

  let purpose =
    request.headers.get("Purpose") ||
    request.headers.get("X-Purpose") ||
    request.headers.get("Sec-Purpose") ||
    request.headers.get("Sec-Fetch-Purpose") ||
    request.headers.get("Moz-Purpose");
  let isPrefetch = purpose === "prefetch";

  // if it's a GET request and it's a prefetch request
  // and it doesn't already have a Cache-Control header
  // we will cache for 10 seconds only on the browser
  if (isGet && isPrefetch && !response.headers.has("Cache-Control")) {
    response.headers.set("Cache-Control", "private, max-age=10");
  }

  if (isGet) {
    let body = await clonedResponse.text();
    response.headers.set("etag", etag(body));

    if (request.headers.get("If-None-Match") === response.headers.get("ETag")) {
      return new Response("", { status: 304, headers: response.headers });
    }
  }

  if (process.env.NODE_ENV === "development") {
    response.headers.set("Cache-Control", "no-cache");
  }

  for (let header of securityHeaders) {
    response.headers.set(...header);
  }

  return response;
};
