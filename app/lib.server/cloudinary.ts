import type { TransformerOption } from "@cld-apis/types";
import { buildUrl } from "cloudinary-build-url";

function getCloudinaryURL(
	cloudName: string,
	publicId: string,
	transformations: TransformerOption = {},
): URL {
	let url = buildUrl(publicId, {
		cloud: { cloudName },
		transformations: {
			quality: "auto",
			fetchFormat: "auto",
			...transformations,
		},
	});

	return new URL(url);
}

let MUGSHOT = "website/xczr00kref9nmq84bgyfnn8p" as const;

export function getMugshotURL(
	cloudName: string,
	transformations: TransformerOption = {},
): URL {
	return getCloudinaryURL(cloudName, MUGSHOT, transformations);
}
