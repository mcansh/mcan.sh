import { createController } from "remix/router"

import { assets } from "../assets.ts"
import { routes } from "../routes.ts"
import { DESIGN_OPTIONS, FONT_OPTIONS, getHomePage, getMe, HomeShell } from "./home-page/shared.tsx"

function getDesignIndex(url: URL): number {
  let param = url.searchParams.get("design")
  if (param) {
    let n = parseInt(param, 10)
    if (!isNaN(n) && n >= 1 && n <= DESIGN_OPTIONS) return n - 1
  }
  return 0
}

function getFontIndex(url: URL): number {
  let param = url.searchParams.get("font")
  if (param) {
    let n = parseInt(param, 10)
    if (!isNaN(n) && n >= 1 && n <= FONT_OPTIONS) return n - 1
  }
  return 0
}

export default createController(routes, {
  actions: {
    async assets(context) {
      let asset = await assets.fetch(context.request)
      return asset ?? new Response("Not Found", { status: 404 })
    },

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
      let designIndex = getDesignIndex(context.url)
      let fontIndex = getFontIndex(context.url)
      let design = await getHomePage(designIndex)

      return context.render(
        <design.HomePage me={getMe(designIndex)} designIndex={designIndex} fontIndex={fontIndex} />,
      )
    },

    manifest(context) {
      return Response.json({}, { status: 404 })
    },

    wellKnown(context) {
      return Response.json({}, { status: 404 })
    },

    resume(context) {
      return Response.json({}, { status: 404 })
    },

    sitemap(context) {
      return Response.json({}, { status: 404 })
    },
  },
})
