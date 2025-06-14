import type { LoaderFunctionArgs } from "react-router";
import { iconSizes, linkColor } from "./utils";

async function createEtag(content: string): Promise<string> {
	let msgUint8 = new TextEncoder().encode(content);
	let hashBuffer = await crypto.subtle.digest("MD5", msgUint8);
	let hashArray = Array.from(new Uint8Array(hashBuffer));
	let hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
	return `W/"${hashHex}"`;
}

export async function loader({ request }: LoaderFunctionArgs) {
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
