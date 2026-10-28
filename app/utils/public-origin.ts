import { env } from "./env.ts"

export function getPublicOrigin(request: Request): string {
  return env.PUBLIC_ORIGIN ?? new URL(request.url).origin
}

export function getPublicHref(pathname: string, request: Request): string {
  return new URL(pathname, getPublicOrigin(request)).href
}

export function getCanonicalHref(request: Request): string {
  return getPublicHref(new URL(request.url).pathname, request)
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
