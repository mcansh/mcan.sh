import type { TransformerOption } from "@cld-apis/types";
import { buildUrl } from "cloudinary-build-url";

import { env } from "./env";

function getCloudinaryURL(
	publicId: string,
	transformations: TransformerOption = {},
): URL {
	let url = buildUrl(publicId, {
		cloud: { cloudName: env.CLOUDINARY_CLOUD_NAME },
		transformations: {
			quality: "auto",
			fetchFormat: "auto",
			...transformations,
		},
	});

	return new URL(url);
}

let MUGSHOT = "website/x8sgp7p77r6dw37haus5924d" as const;

export function getMugshotURL(transformations: TransformerOption = {}): URL {
	return getCloudinaryURL(MUGSHOT, transformations);
}
