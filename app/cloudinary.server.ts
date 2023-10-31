import { buildUrl } from "cloudinary-build-url";
import type { TransformerOption } from "@cld-apis/types";

import { env } from "./env.server";

export function getCloudinaryURL(
	publicId: string,
	transformations: TransformerOption = {},
) {
	return buildUrl(publicId, {
		cloud: { cloudName: env.CLOUDINARY_CLOUD_NAME },
		transformations: {
			quality: "auto",
			fetchFormat: "auto",
			...transformations,
		},
	});
}

export let MUGSHOT = "website/FullSizeRender" as const;
