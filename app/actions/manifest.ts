import { createHash } from "node:crypto"

const iconSizes = [32, 57, 72, 96, 120, 128, 144, 152, 195, 228]
const manifest = JSON.stringify(
  {
    name: "Logan McAnsh",
    short_name: "LM",
    description: "personal website for logan mcansh",
    start_url: "/?homescreen=1",
    background_color: "#e53a40",
    theme_color: "#e53a40",
    display: "standalone",
    icons: [
      ...iconSizes.map((size) => ({
        src: `/logo-${size}.png`,
        sizes: `${size}x${size}`,
        type: "image/png",
      })),
      { src: "/favicon.png", sizes: "1024x1024", type: "image/png" },
    ],
  },
  null,
  2,
)
const etag = `W/"${createHash("sha256").update(manifest).digest("hex")}"`

export function createManifestResponse(request: Request): Response {
  let headers = {
    "Content-Type": "application/manifest+json; charset=utf-8",
    "Cache-Control": "public, max-age=60, must-revalidate",
    ETag: etag,
  }
  let matches = request.headers
    .get("If-None-Match")
    ?.split(",")
    .some((candidate) => {
      let tag = candidate.trim()
      return tag === "*" || tag.replace(/^W\//, "") === etag.slice(2)
    })
  return new Response(matches ? null : manifest, { status: matches ? 304 : 200, headers })
}
