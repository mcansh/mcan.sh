import { buildUrl } from "cloudinary-build-url";
import type { TransformerOption } from "@cld-apis/types";
import { z } from "zod";

let envSchema = z.object({
	CLOUDINARY_CLOUD_NAME: z.string(),
});

let env = envSchema.parse(process.env);

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
