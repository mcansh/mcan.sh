export function applyPublicOrigin(request: Request, publicOrigin: string | undefined): Request {
  if (!publicOrigin) return request
  let url = new URL(request.url)
  return new Request(new URL(`${url.pathname}${url.search}${url.hash}`, publicOrigin), request)
}
