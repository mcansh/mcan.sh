import type { EntryContext, HandleDataRequestFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { createSecureHeaders } from "@mcansh/remix-secure-headers";
import { renderToString } from "react-dom/server";

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

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}

export const handleDataRequest: HandleDataRequestFunction = (response) => {
  if (process.env.NODE_ENV === "development") {
    response.headers.set("Cache-Control", "no-cache");
  }

  for (let header of securityHeaders) {
    response.headers.set(...header);
  }

  return response;
};
