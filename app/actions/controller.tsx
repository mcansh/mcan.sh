import { createController } from "remix/router"

import { routes } from "../routes.ts"
import { getOpenGraphImageUrl } from "../utils/cloudinary.ts"
import { env } from "../utils/env.ts"
import { getSeo } from "../utils/public-origin.ts"
import { Document } from "./document.tsx"
import { getIndex } from "./home-page/selection.ts"
import { DESIGN_OPTIONS, getHomePage, getMe, HomeShell } from "./home-page/shared.tsx"
import { createManifestResponse } from "./manifest.ts"
import { FONT_OPTIONS } from "./public/fonts.ts"
import { ResumePage } from "./resume-page.tsx"
import { createSitemapResponse } from "./sitemap.ts"
import { createWellKnownResponse } from "./well-known.ts"

function getDesignIndex(url: URL): number {
  return getIndex(url.searchParams.get("design"), DESIGN_OPTIONS)
}

function getFontIndex(url: URL): number {
  return getIndex(url.searchParams.get("font"), FONT_OPTIONS)
}

export default createController(routes, {
  actions: {
    async home(context) {
      let designIndex = getDesignIndex(context.url)
      let fontIndex = getFontIndex(context.url)
      let design = await getHomePage(designIndex)

      return context.render(
        <HomeShell
          me={getMe(designIndex)}
          designIndex={designIndex}
          fontIndex={fontIndex}
          bodyMix={design.homePageOptions}
        />,
      )
    },

    async preview(context) {
      let headers = {
        "Cache-Control": "no-store",
        Vary: "X-Remix-Frame",
        "X-Robots-Tag": "noindex",
      }
      if (context.headers.get("X-Remix-Frame") !== "true") {
        let seo = getSeo(context.request)
        return context.render(
          <Document
            title="Not Found"
            description={seo.site.description}
            ogImage={getOpenGraphImageUrl(env.CLOUDINARY_CLOUD_NAME)}
            fontIndex={0}
            robots={seo.robotsTag({ index: false })}
          >
            Not Found
          </Document>,
          { status: 404, headers },
        )
      }

      let designIndex = getDesignIndex(context.url)
      let fontIndex = getFontIndex(context.url)
      let design = await getHomePage(designIndex)

      return context.render(
        <design.HomePage me={getMe(designIndex)} designIndex={designIndex} fontIndex={fontIndex} />,
        { headers },
      )
    },

    manifest(context) {
      if (!["json", "webmanifest"].includes(context.params.ext)) {
        return new Response("Not Found", { status: 404 })
      }
      return createManifestResponse(context.request)
    },

    wellKnownAvatar(context) {
      return createWellKnownResponse(context.params.path, context.request)
    },

    resume(context) {
      return context.render(<ResumePage />)
    },

    sitemap(context) {
      return createSitemapResponse(context.request)
    },
  },
})
