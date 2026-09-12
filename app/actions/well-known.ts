import { getMugshotURL } from "../utils/cloudinary.ts"
import { env } from "../utils/env.ts"

export async function createWellKnownResponse(
  path: string,
  request: Request,
  fetchImage: typeof fetch = fetch,
): Promise<Response> {
  let segments = path.split("/")
  if (segments.pop() !== "avatar") {
    return new Response("ope not found", {
      status: 404,
      statusText: "Not Found",
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }

  let image = getMugshotURL(env.CLOUDINARY_CLOUD_NAME)
  let pathSegments = image.pathname.split("/")
  let transformIndex = pathSegments.findIndex((segment) => segment.includes(","))
  if (transformIndex === -1) throw new Error("Missing avatar transformation segment")
  pathSegments[transformIndex] = [pathSegments[transformIndex], ...segments].join(",")
  image.pathname = pathSegments.join("/")

  return fetchImage(image, { method: request.method, signal: request.signal })
}
