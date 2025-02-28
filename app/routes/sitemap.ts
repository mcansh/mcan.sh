export function loader() {
 let content = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://www.mcan.sh/</loc>
        <lastmod>2025-02-27</lastmod>
        <changefreq>daily</changefreq>
        <priority>1</priority>
    </url>
    <url>
        <loc>https://www.mcan.sh/resume</loc>
        <lastmod>2025-02-27</lastmod>
        <changefreq>daily</changefreq>
        <priority>1</priority>
    </url>
</urlset>
`;

    return new Response(content, {
        headers: {
            "Content-Type": "text/xml",
        }
    });
}