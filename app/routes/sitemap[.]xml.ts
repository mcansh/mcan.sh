export async function loader({ request }: { request: Request }) {
	let url = new URL(request.url);
	let content = `<?xml version="1.0" encoding="UTF-8"?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
			<url>
				<loc>${url.origin}/</loc>
				<priority>1.0</priority>
				<changefreq>daily</changefreq>
			</url>
			<url>
				<loc>${url.origin}/resume</loc>
				<priority>0.8</priority>
				<changefreq>monthly</changefreq>
			</url>
		</urlset>
	`;

	return new Response(content.trim(), {
		headers: {
			"Content-Type": "application/xml",
			"Cache-Control": "public, max-age=3600",
		},
	});
}
