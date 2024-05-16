import type { LoaderFunctionArgs } from "@remix-run/node";
import type { ResponseStub } from "@remix-run/server-runtime/dist/single-fetch";

import { getMugshotURL } from "~/cloudinary.server";

function throwResponse(response: ResponseStub | undefined, status: number) {
	if (response) {
		response.status = status;
		throw response;
	}

	throw new Response(null, { status });
}

export async function loader({ params, response }: LoaderFunctionArgs) {
	let splat = params["*"];

	if (!splat) throw throwResponse(response, 404);

	let segments = splat.split("/");
	if (segments.at(-1) !== "avatar") throw throwResponse(response, 404);

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

	if (urlSegmentIndex === -1) throw throwResponse(response, 404);

	let transformSegment = pathSegments.at(urlSegmentIndex);

	if (!transformSegment) throw throwResponse(response, 404);

	// merge our segments with the url segments with a comma
	transformSegment = [...transformSegment.split(","), ...segments].join(",");

	// replace the old transform segment with our new one
	pathSegments[urlSegmentIndex] = transformSegment;

	// replace the pathname with our new segments
	image.pathname = pathSegments.join("/");

	return fetch(image);
}
