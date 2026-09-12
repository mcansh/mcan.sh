import { getMugshotURL } from "../utils/cloudinary.ts"
import { env } from "../utils/env.ts"

export async function createWellKnownResponse(
  path: string | undefined,
  request: Request,
  fetchImage: typeof fetch = fetch,
): Promise<Response> {
  let segments = path?.split("/") ?? []

  let image = getMugshotURL(env.CLOUDINARY_CLOUD_NAME)
  let pathSegments = image.pathname.split("/")
  let transformIndex = pathSegments.findIndex((segment) => segment.includes(","))
  if (transformIndex === -1) throw new Error("Missing avatar transformation segment")
  pathSegments[transformIndex] = [pathSegments[transformIndex], ...segments].join(",")
  image.pathname = pathSegments.join("/")

  return fetchImage(image, { method: request.method, signal: request.signal })
}
