import type { DataFunctionArgs } from "@remix-run/server-runtime";

import { getCloudinaryURL, MUGSHOT } from "~/cloudinary";

let badRequest = new Response("ope", {
	status: 404,
	statusText: "Not Found",
	headers: { "Content-Type": "text/plain" },
});

export async function loader({ params, request }: DataFunctionArgs) {
	let splat = params["*"];

	if (!splat) {
		return badRequest;
	}

	let segments = splat.split("/");
	if (segments.at(-1) !== "avatar") {
		return badRequest;
	}

	// remove the last segment (avatar)
	segments = segments.slice(0, -1);

	let image = getCloudinaryURL(MUGSHOT);

	let url = new URL(image);

	let pathSegments = url.pathname.split("/").filter(Boolean);

	let urlSegmentIndex = pathSegments.findIndex((segment) => {
		return segment.includes(",");
	});

	if (urlSegmentIndex === -1) {
		return badRequest;
	}

	let transformSegment = pathSegments[urlSegmentIndex];

	if (!transformSegment) {
		return badRequest;
	}

	// merge our segments with the url segments with a comma
	transformSegment = transformSegment + "," + segments.join(",");

	// replace the old transform segment with our new one
	pathSegments[urlSegmentIndex] = transformSegment;

	// replace the pathname with our new segments
	url.pathname = pathSegments.join("/");

	image = url.toString();

	return fetch(image);
}
