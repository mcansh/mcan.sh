import type { LoaderFunctionArgs } from "@remix-run/node";

import { getMugshotURL } from "~/cloudinary.server";

let notFound = new Response("ope not found", {
	status: 404,
	statusText: "Not Found",
	headers: { "Content-Type": "text/plain" },
});

export async function loader({ params }: LoaderFunctionArgs) {
	let splat = params["*"];

	if (!splat) throw notFound;

	let segments = splat.split("/");
	if (segments.at(-1) !== "avatar") throw notFound;

	// remove the last segment (avatar)
	// the remaining segments are the transformations that we can forward to cloudinary
	segments = segments.slice(0, -1);

	// get the original image using our default transformations
	let image = getMugshotURL();

	// split the pathname into segments
	let pathSegments = image.pathname.split("/").filter(Boolean);

	// find the segment that contains the transformations
	let urlSegmentIndex = pathSegments.findIndex((segment) => {
		return segment.includes(",");
	});

	if (urlSegmentIndex === -1) throw notFound;

	let transformSegment = pathSegments.at(urlSegmentIndex);

	if (!transformSegment) throw notFound;

	// merge our segments with the url segments with a comma
	transformSegment = [...transformSegment.split(","), ...segments].join(",");

	// replace the old transform segment with our new one
	pathSegments[urlSegmentIndex] = transformSegment;

	// replace the pathname with our new segments
	image.pathname = pathSegments.join("/");

	return fetch(image);
}
