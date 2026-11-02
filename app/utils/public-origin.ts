export function applyPublicOrigin(request: Request, publicOrigin: string | undefined): Request {
  if (!publicOrigin) return request
  let incoming = new URL(request.url)
  let rewritten = new URL(publicOrigin)
  rewritten.pathname = incoming.pathname
  rewritten.search = incoming.search
  rewritten.hash = incoming.hash
  return new Request(rewritten, request)
}
