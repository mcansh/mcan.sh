import { html } from "remix/html-template"
import { createHtmlResponse } from "remix/response/html"

import { DEFAULT_PUBLIC_ORIGIN } from "../utils/env.ts"

export function createPreviewNotFoundResponse(headers: HeadersInit): Response {
  let body = html`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <link rel="canonical" href="${DEFAULT_PUBLIC_ORIGIN}/">
    <meta name="robots" content="noindex">
    <title>Not Found</title>
  </head>
  <body>Not Found</body>
</html>`

  return createHtmlResponse(body, { status: 404, headers })
}
