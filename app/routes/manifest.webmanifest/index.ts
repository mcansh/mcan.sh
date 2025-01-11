import createEtag from "etag";
import type { Route } from "./+types/index";
import { iconSizes, linkColor } from "./utils";

export function loader({ request }: Route.LoaderArgs) {
	let content = {
		name: "Logan McAnsh",
		short_name: "LM",
		description: "personal website for logan mcansh",
		start_url: "/?homescreen=1",
		background_color: linkColor,
		theme_color: linkColor,
		display: "standalone",
		icons: iconSizes,
	};

	let manifest = JSON.stringify(content, null, 2);

	let etag = createEtag(manifest);

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
