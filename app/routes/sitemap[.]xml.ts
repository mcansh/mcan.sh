export async function loader() {
	let domain = "https://mcan.sh";
	let content = `
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
			<url>
				<loc>${domain}/</loc>
				<priority>1.0</priority>
				<changefreq>daily</changefreq>
			</url>
			<url>
				<loc>${domain}/resume</loc>
				<priority>0.8</priority>
				<changefreq>monthly</changefreq>
			</url>
		</urlset>
	`;

	return new Response(content.trim(), {
		headers: {
			"Content-Type": "application/xml",
			"Cache-Control": "public, max-age=3600",
			"xml-version": "1.0",
			encoding: "UTF-8",
		},
	});
}
