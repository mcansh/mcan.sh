import { createHash } from "node:crypto"

import { IfNoneMatch } from "remix/headers/if-none-match"

const ICON_SIZES = [32, 57, 72, 96, 120, 128, 144, 152, 195, 228]

const MANIFEST_CONTENT = Object.freeze({
  name: "Logan McAnsh",
  short_name: "LM",
  description: "personal website for logan mcansh",
  start_url: "/?homescreen=1",
  background_color: "#e53a40",
  theme_color: "#e53a40",
  display: "standalone",
  icons: [
    ...ICON_SIZES.map((size) => ({
      src: `/logo-${size}.png`,
      sizes: `${size}x${size}`,
      type: "image/png",
    })),
    { src: "/favicon.png", sizes: "1024x1024", type: "image/png" },
  ],
})

const MANIFEST_STRING = JSON.stringify(MANIFEST_CONTENT, null, 2)

const etag = `W/"${createHash("sha256").update(MANIFEST_STRING).digest("hex")}"`

export function createManifestResponse(request: Request): Response {
  let headers = {
    "Content-Type": "application/manifest+json; charset=utf-8",
    "Cache-Control": "public, max-age=60, must-revalidate",
    ETag: etag,
  }

  let ifNoneMatch = IfNoneMatch.from(request.headers.get("If-None-Match"))
  let matches = ifNoneMatch.matches(etag) || ifNoneMatch.matches(etag.slice(2))

  return new Response(matches ? null : MANIFEST_STRING, { status: matches ? 304 : 200, headers })
}
