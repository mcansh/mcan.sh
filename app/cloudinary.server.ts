import { buildUrl } from "cloudinary-build-url";
import type { TransformerOption } from "@cld-apis/types";
import { Config } from "sst/node/config";

export function getCloudinaryURL(
  publicId: string,
  transformations: TransformerOption
) {
  return buildUrl(publicId, {
    cloud: { cloudName: Config.CLOUDINARY_CLOUD_NAME },
    transformations: {
      quality: "auto",
      fetchFormat: "auto",
      ...transformations,
    },
  });
}
