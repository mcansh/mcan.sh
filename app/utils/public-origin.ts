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
