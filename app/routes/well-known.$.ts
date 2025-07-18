import { getMugshotURL } from "#app/lib.server/cloudinary.js";
import { adapterContext } from "#workers/app.js";
import type { Route } from "./+types/well-known.$";

function notFound() {
	throw new Response("ope not found", {
		status: 404,
		statusText: "Not Found",
		headers: { "Content-Type": "text/plain" },
	});
}

export function loader({ context, params }: Route.LoaderArgs) {
	let env = context.get(adapterContext);
	let splat = params["*"];

	if (!splat) notFound();

	let segments = splat.split("/");
	if (segments.at(-1) !== "avatar") notFound();

	// remove the last segment (avatar)
	// the remaining segments are the transformations that we can forward to cloudinary
	segments = segments.slice(0, -1);

	// get the original image using our default transformations
	let image = getMugshotURL(env.CLOUDINARY_CLOUD_NAME);

	// split the pathname into segments
	let pathSegments = image.pathname.split("/").filter(Boolean);

	// find the segment that contains the transformations
	let urlSegmentIndex = pathSegments.findIndex((segment) => {
		return segment.includes(",");
	});

	if (urlSegmentIndex === -1) notFound();

	let transformSegment = pathSegments.at(urlSegmentIndex);

	if (!transformSegment) notFound();

	// merge our segments with the url segments with a comma
	transformSegment = [...transformSegment.split(","), ...segments].join(",");

	// replace the old transform segment with our new one
	pathSegments[urlSegmentIndex] = transformSegment;

	// replace the pathname with our new segments
	image.pathname = pathSegments.join("/");

	return fetch(image);
}
