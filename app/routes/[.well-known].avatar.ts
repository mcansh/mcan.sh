import type { DataFunctionArgs } from "@remix-run/node";

import { getCloudinaryURL } from "~/cloudinary.server";

export function loader({ request }: DataFunctionArgs) {
	let url = new URL(request.url);

	let width = url.searchParams.get("w") || url.searchParams.get("width");
	let height = url.searchParams.get("h") || url.searchParams.get("height");

	if (width && !height) height = width;
	if (height && !width) width = height;

	let image = getCloudinaryURL("website/FullSizeRender", {
		resize: width && height ? { width, height } : undefined,
	});

	return fetch(image);
}
