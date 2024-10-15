import type { TransformerOption } from "@cld-apis/types";
import type { AppLoadContext } from "@remix-run/cloudflare";
import { buildUrl } from "cloudinary-build-url";

function getCloudinaryURL(
	context: AppLoadContext,
	publicId: string,
	transformations: TransformerOption = {},
): URL {
	let url = buildUrl(publicId, {
		cloud: { cloudName: context.env.CLOUDINARY_CLOUD_NAME },
		transformations: {
			quality: "auto",
			fetchFormat: "auto",
			...transformations,
		},
	});

	return new URL(url);
}

let MUGSHOT = "website/1663416590737636005" as const;

export function getMugshotURL(
	context: AppLoadContext,
	transformations: TransformerOption = {},
): URL {
	return getCloudinaryURL(context, MUGSHOT, transformations);
}
