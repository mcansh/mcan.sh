import type { EntryContext } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { createSecureHeaders } from "@mcansh/remix-secure-headers";
import { renderToString } from "react-dom/server";

const securityHeaders = createSecureHeaders({
  "Content-Security-Policy": {
    "default-src": ["'self'"],
    "img-src": [
      "'self'",
      "https://res.cloudinary.com/dof0zryca/image/upload/",
      "https://thirtyseven-active.b-cdn.net",
    ],
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      "https://thirtyseven-active.b-cdn.net/script.js",
    ],
    "style-src": ["'self'", "'unsafe-inline'"],
    "media-src": [""],
    "connect-src": ["*"],
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

  if (process.env.NODE_ENV === "development") {
    responseHeaders.set("Cache-Control", "no-cache");
  }

  responseHeaders.set("Content-Type", "text/html");
  for (let header of securityHeaders) {
    responseHeaders.set(...header);
  }

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
