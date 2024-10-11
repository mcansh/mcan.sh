import type { LoaderFunctionArgs } from "@remix-run/cloudflare";

import { createEtag } from "#app/.server/etag.js";

let uniqueIconSizes = new Set([
	32, 57, 72, 96, 120, 128, 144, 152, 195, 228, 512,
]);

export let iconSizes = [...uniqueIconSizes].map((size) => {
	return {
		src: `/logo-${size}.png`,
		sizes: `${size}x${size}`,
	};
});

export async function loader({ request }: LoaderFunctionArgs) {
	let content = {
		name: "Logan McAnsh",
		short_name: "LM",
		description: "personal website for logan mcansh",
		start_url: "/?homescreen=1",
		background_color: "#e53a40",
		theme_color: "#e53a40",
		display: "standalone",
		icons: iconSizes,
	};

	let manifest = JSON.stringify(content, null, 2);

	let etag = await createEtag(manifest);

	if (request.headers.get("If-None-Match") === etag) {
		return new Response(null, {
			status: 304,
			statusText: "Not Modified",
			headers: { ETag: etag },
		});
	}

	return new Response(manifest, {
		headers: {
			"Content-Type": "application/json",
			ETag: etag,
			"Cache-Control": "public, max-age=60, must-revalidate",
		},
	});
}
