import type { TransformerOption } from "@cld-apis/types";
import type { DataFunctionArgs } from "@remix-run/server-runtime";

import { getCloudinaryURL, MUGSHOT } from "~/cloudinary.server";

export function loader({ request }: DataFunctionArgs) {
	let url = new URL(request.url);

	let width = url.searchParams.get("w") || url.searchParams.get("width");
	let height = url.searchParams.get("h") || url.searchParams.get("height");

	if (width && !height) height = width;
	if (height && !width) width = height;

	let transform: TransformerOption = { resize: { type: "fill" } };

	if (width && height) {
		transform.resize ||= { type: "fill" };
		transform.resize.width = width;
		transform.resize.height = height;
	}

	let image = getCloudinaryURL(MUGSHOT, transform);

	return fetch(image);
}
