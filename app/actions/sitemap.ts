import { routes } from "../routes.ts"
import { getPublicHref } from "../utils/public-origin.ts"

export function createSitemapResponse(request: Request): Response {
  let home = getPublicHref(routes.home.href(), request).replaceAll("&", "&amp;")
  let resume = getPublicHref(routes.resume.href(), request).replaceAll("&", "&amp;")
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${home}</loc>
    <priority>1.0</priority>
    <changefreq>daily</changefreq>
  </url>
  <url>
    <loc>${resume}</loc>
    <priority>0.8</priority>
    <changefreq>monthly</changefreq>
  </url>
</urlset>`,
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    },
  )
}
