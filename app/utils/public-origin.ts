import { createSeo } from "@sdxc/seo"

import { env } from "./env.ts"

export function getSeo(request: Request) {
  return createSeo({
    baseUrl: getPublicOrigin(request),
    siteName: "Logan McAnsh",
    defaultDescription:
      "Logan McAnsh is a senior software engineer focused on web frameworks, developer tooling, and application architecture. Former Remix Core Team member at Shopify, now building developer tools at United Wholesale Mortgage.",
  })
}

export function getPublicOrigin(request: Request): string {
  return env.PUBLIC_ORIGIN ?? new URL(request.url).origin
}

export function getPublicHref(pathname: string, request: Request): string {
  return getSeo(request).absolute(pathname)
}

export function getCanonicalHref(request: Request): string {
  return getSeo(request).canonical(new URL(request.url).pathname)
}

export function applyPublicOrigin(request: Request, publicOrigin: string | undefined): Request {
  if (!publicOrigin) return request
  let incoming = new URL(request.url)
  let rewritten = new URL(publicOrigin)
  rewritten.pathname = incoming.pathname
  rewritten.search = incoming.search
  rewritten.hash = incoming.hash
  return new Request(rewritten, request)
}
