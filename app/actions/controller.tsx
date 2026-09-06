import { createController } from "remix/router";

import { assets } from "../assets.ts";
import { routes } from "../routes.ts";
import { getMugshotURL } from "../utils/cloudinary.ts";
import { env } from "../utils/env.ts";
import { HomePageOption4 } from "./home-page/four.tsx";
import { HomePageOption1 } from "./home-page/one.tsx";
import { HomePageOption3 } from "./home-page/three.tsx";
import { HomePageOption2 } from "./home-page/two.tsx";

const DESIGN_OPTIONS = 4
const FONT_OPTIONS = 5

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

    home(context) {
      let srcSet = [240, 480, 720].map((size, index) => {
        let url = getMugshotURL(env.CLOUDINARY_CLOUD_NAME, {
          resize: { type: "fill", width: size, height: size },
        })

        return { url, size, density: index + 1 }
      })

      let me = srcSet.at(1)
      if (me === undefined) throw new Error("Failed to get mugshot")

      let designIndex = getDesignIndex(context.url)
      let fontIndex = getFontIndex(context.url)

      const HOME_DESIGNS = [HomePageOption1, HomePageOption2, HomePageOption3, HomePageOption4] as const

      let index = designIndex ?? 0
      let Design = HOME_DESIGNS[index] ?? HomePageOption1

      return context.render(
        <Design
          me={{
            url: me.url.toString(),
            size: me.size,
            srcSet: srcSet.map((x) => `${x.url} ${x.density}x`).join(", "),
          }}
          designIndex={designIndex}
          fontIndex={fontIndex}
        />,
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
