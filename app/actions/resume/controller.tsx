import Cloudflare from "cloudflare"
import { CacheControl } from "remix/headers/cache-control"
import { createController } from "remix/router"

import { routes } from "../../routes.ts"
import { env } from "../../utils/env.ts"
import { ResumePage } from "../resume-page.tsx"

let cachedPdf: { response: Response; expiresAt: number } | undefined
let pendingPdf: Promise<Response> | undefined

export const resume = createController(routes.resume, {
  actions: {
    index(context) {
      return context.render(<ResumePage />)
    },

    async pdf() {
      if (!env.CLOUDFLARE_ACCOUNT_ID || !env.CLOUDFLARE_API_TOKEN) {
        return new Response("Unauthorized", { status: 401 })
      }

      if (cachedPdf && Date.now() < cachedPdf.expiresAt) {
        return cachedPdf.response.clone()
      }

      pendingPdf ??= renderPdf(env.CLOUDFLARE_ACCOUNT_ID, env.CLOUDFLARE_API_TOKEN)
        .then((response) => {
          if (response.ok) {
            cachedPdf = { response, expiresAt: Date.now() + 60 * 60 * 1000 }
          }
          return response
        })
        .finally(() => {
          pendingPdf = undefined
        })

      return (await pendingPdf).clone()
    },
  },
})

async function renderPdf(accountId: string, apiToken: string) {
  let client = new Cloudflare({ apiToken })

  let url = new URL(routes.resume.index.href(), env.PUBLIC_ORIGIN ?? "https://mcan.sh").href

  let result = await client.browserRendering.pdf.create({
    url,
    account_id: accountId,
    viewport: { height: 1080, width: 1920, deviceScaleFactor: 2 },
    pdfOptions: {
      printBackground: true,
      margin: { top: "20", bottom: "20", left: "20", right: "20" },
    },
  })

  if (!result.ok) {
    return new Response(await result.blob(), {
      status: result.status,
      headers: result.headers,
    })
  }

  let headers = new Headers(result.headers)

  headers.set(
    "Cache-Control",
    new CacheControl({
      public: true,
      maxAge: 300, // 5 minutes
      staleWhileRevalidate: 3600, // 1 hour
      sMaxage: 3600, // 1 hour
    }).toString(),
  )

  return new Response(await result.blob(), { headers })
}
