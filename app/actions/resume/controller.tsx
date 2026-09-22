import Cloudflare from "cloudflare"
import { CacheControl } from "remix/headers/cache-control"
import { createController } from "remix/router"

import { router } from "../../router.ts"
import { routes } from "../../routes.ts"
import { env } from "../../utils/env.ts"
import { ResumePage } from "../resume-page.tsx"

export const resume = createController(routes.resume, {
  actions: {
    index(context) {
      return context.render(<ResumePage />)
    },

    async pdf(context) {
      if (!env.CLOUDFLARE_ACCOUNT_ID || !env.CLOUDFLARE_API_TOKEN) {
        return new Response("Unauthorized", { status: 401 })
      }

      let client = new Cloudflare({
        apiToken: env.CLOUDFLARE_API_TOKEN,
      })

      let url = new URL(routes.resume.index.href(), context.url.origin)
      let response = await router.fetch(url)

      if (!response.ok) {
        return response
      }

      let result = await client.browserRendering.pdf.create({
        account_id: env.CLOUDFLARE_ACCOUNT_ID,
        viewport: { height: 1080, width: 1920, deviceScaleFactor: 2 },
        pdfOptions: {
          printBackground: true,
          margin: { top: "20", bottom: "20", left: "20", right: "20" },
        },
        html: await response.text(),
      })

      if (!result.ok) {
        return result
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

      return new Response(result.body, {
        headers,
      })
    },
  },
})
