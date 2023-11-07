import type { TransformerOption } from "@cld-apis/types";
import { buildUrl } from "cloudinary-build-url";

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

export let MUGSHOT = "website/c12fskgl4pkrs30aj40g5xl8" as const;
