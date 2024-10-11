import type { TransformerOption } from "@cld-apis/types";
import { buildUrl } from "cloudinary-build-url";

import { env } from "./env.server";

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

let MUGSHOT = "website/zitzbp5hl2p5mdw8pdec" as const;

export function getMugshotURL(transformations: TransformerOption = {}): URL {
	return getCloudinaryURL(MUGSHOT, transformations);
}
