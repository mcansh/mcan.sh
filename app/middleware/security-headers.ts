import { createNonce, createSecureHeaders, mergeHeaders } from "@mcansh/http-helmet"
import { getContext } from "remix/middleware/async-context"
import type { Middleware } from "remix/router"
import { createContextKey } from "remix/router"

import { env } from "../utils/env.ts"

const nonceKey = createContextKey<string>()

export function getNonce(): string {
  let nonce = getContext().get(nonceKey)
  if (!nonce) throw new Error("Security headers middleware is not installed")
  return nonce
}

export function securityHeaders(): Middleware<{ key: typeof nonceKey; value: string }> {
  return async (context, next) => {
    let nonce = createNonce()
    context.set(nonceKey, nonce)
    return applySecurityHeaders(await next(), context.request, nonce)
  }
}

export function applySecurityHeaders(
  response: Response,
  request: Request,
  nonce = createNonce(),
): Response {
  let url = new URL(request.url)
  let isDevelopment = process.env.NODE_ENV === "development"
  let isLocalhost =
    ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) ||
    url.hostname.endsWith(".localhost")
  let securityHeaders = createSecureHeaders({
    "Content-Security-Policy": {
      "default-src": ["'none'"],
      "base-uri": ["'self'"],
      "frame-ancestors": ["'none'"],
      "img-src": [
        "'self'",
        `https://res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}/image/upload/`,
      ],
      // The import-map polyfill uses a WebAssembly module parser.
      "script-src": ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'", "'wasm-unsafe-eval'"],
      "connect-src": [
        "'self'",
        ...(isDevelopment ? ["ws:", "wss:", process.env.HMR_EVENT_ORIGIN] : []),
      ],
      "worker-src": ["blob:"],
      "manifest-src": ["'self'"],
      "font-src": ["'self'", "https://fonts.gstatic.com"],
      // Remix's css() renderer emits style tags without nonce support.
      "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      "report-uri": [env.SENTRY_REPORT_URL],
      "upgrade-insecure-requests": process.env.NODE_ENV === "production" && !isLocalhost,
    },
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "X-DNS-Prefetch-Control": "on",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": true,
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
    "Referrer-Policy": "same-origin",
    "Cross-Origin-Embedder-Policy": "require-corp",
    "Cross-Origin-Resource-Policy": "cross-origin",
  })

  let headers = mergeHeaders(new Headers(response.headers), securityHeaders)

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
