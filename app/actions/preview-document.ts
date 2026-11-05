import { html } from "remix/html-template"
import { createHtmlResponse } from "remix/response/html"

import { routes } from "../routes.ts"
import { getSeo } from "../utils/public-origin.ts"

export function createPreviewNotFoundResponse(request: Request, headers: HeadersInit): Response {
  let canonical = getSeo(request).canonical(routes.home.href())
  let body = html`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <link rel="canonical" href="${canonical}">
    <meta name="robots" content="noindex">
    <title>Not Found</title>
  </head>
  <body>Not Found</body>
</html>`

  return createHtmlResponse(body, { status: 404, headers })
}
