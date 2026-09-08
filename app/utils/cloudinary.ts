import type { TransformerOption } from "@cld-apis/types"
import { buildUrl } from "cloudinary-build-url"

export function getCloudinaryURL(
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
  })

  return new URL(url)
}

const MUGSHOT = "website/2498016352165139482" as const

export function getMugshotURL(cloudName: string, transformations: TransformerOption = {}): URL {
  return getCloudinaryURL(cloudName, MUGSHOT, transformations)
}
