import { getMugshotURL } from "#app/lib/cloudinary.ts"
import { env } from "#app/lib/env.ts"
import type { routes } from "#app/routes.ts"
import type { BuildAction } from "remix/fetch-router"

export const wellKnownProfileHandler = {
	middleware: [],
	action({ params }) {
		let splat = params["path"]
		console.log({ splat })
		if (!splat) {
			return new Response(null, { status: 404, statusText: "Not Found" })
		}
		let segments = splat.split("/")
		if (segments.at(-1) !== "avatar") {
			return new Response(null, { status: 404, statusText: "Not Found" })
		}

		// remove the last segment (avatar)
		// the remaining segments are the transformations that we can forward to cloudinary
		segments = segments.slice(0, -1)

		// get the original image using our default transformations
		let image = getMugshotURL(env.CLOUDINARY_CLOUD_NAME)

		// split the pathname into segments
		let pathSegments = image.pathname.split("/").filter(Boolean)

		// find the segment that contains the transformations
		let urlSegmentIndex = pathSegments.findIndex((segment) => {
			return segment.includes(",")
		})

		if (urlSegmentIndex === -1) {
			return new Response(null, { status: 404, statusText: "Not Found" })
		}

		let transformSegment = pathSegments.at(urlSegmentIndex)

		if (!transformSegment) {
			return new Response(null, { status: 404, statusText: "Not Found" })
		}

		// merge our segments with the url segments with a comma
		transformSegment = [...transformSegment.split(","), ...segments].join(",")

		// replace the old transform segment with our new one
		pathSegments[urlSegmentIndex] = transformSegment

		// replace the pathname with our new segments
		image.pathname = pathSegments.join("/")

		return fetch(image)
	},
} satisfies BuildAction<"GET", typeof routes.wellKnown>
