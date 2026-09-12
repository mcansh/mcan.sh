import { routes } from "../routes.ts"

export function createSitemapResponse(request: Request): Response {
  let origin = new URL(request.url).origin
  let home = new URL(routes.home.href(), origin).href.replaceAll("&", "&amp;")
  let resume = new URL(routes.resume.href(), origin).href.replaceAll("&", "&amp;")
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
