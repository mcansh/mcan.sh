import { createController } from "remix/router";

import type { TransformerOption } from "@cld-apis/types";
import { assets } from "../assets.ts";
import { routes } from "../routes.ts";
import { getCloudinaryURL } from "../utils/cloudinary.ts";
import { env } from "../utils/env.ts";
import { HomePageOption4Content, homePageOption4Body } from "./home-page/four.tsx";
import { HomePageOption1Content, homePageOption1Body } from "./home-page/one.tsx";
import { HomeShell } from "./home-page/shared.tsx";
import { HomePageOption3Content, homePageOption3Body } from "./home-page/three.tsx";
import { HomePageOption2Content, homePageOption2Body } from "./home-page/two.tsx";

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

function createSrcSet(sizes: [h: number, w: number][], publicId: string, transformations: (h: number, w: number) => TransformerOption) {
  return sizes.map(([h, w], index) => {

    let url = getCloudinaryURL(env.CLOUDINARY_CLOUD_NAME, publicId, transformations(h, w))

    return { url, size: `${h}x${w}`, density: index + 1, width: w, height: h }
  })
}

function getMe(designIndex: number): {
  url: string;
  size: string;
  srcSet: string;
  height: number;
  width: number;
} {
  let srcSet: ReturnType<typeof createSrcSet>

  if (designIndex === 1) {
    srcSet = createSrcSet([
      [4032, 1443],
      [4032, 1443],
    ], "website/k0aidnurzmmz1zpo92e8ei1i", (h, w) => {
      return {
        resize: {
          type: "crop",
          height: h,
          width: w,
        },
      }
    })
  } else {
    srcSet = createSrcSet([
      [240, 240],
      [480, 480],
      [720, 720],
    ], "website/2498016352165139482", (h, w) => {
      return {
        resize: {
          type: "thumb",
          height: h,
          width: w,
        },
        zoom: 0.5,
        gravity: "face"
      }
    })
  }

  let me = srcSet.at(1)
  if (me === undefined) throw new Error("Failed to get mugshot")

  return {
    url: me.url.toString(),
    size: me.size,
    srcSet: srcSet.map((x) => `${x.url.toString()} ${x.density}x`).join(", "),
    height: me.height,
    width: me.width,
  }
}

const HOME_DESIGNS = [
  HomePageOption1Content,
  HomePageOption2Content,
  HomePageOption3Content,
  HomePageOption4Content,
] as const

const HOME_BODY_STYLES = [
  homePageOption1Body,
  homePageOption2Body,
  homePageOption3Body,
  homePageOption4Body,
] as const

export default createController(routes, {
  actions: {
    async assets(context) {
      let asset = await assets.fetch(context.request)
      return asset ?? new Response("Not Found", { status: 404 })
    },

    home(context) {
      let designIndex = getDesignIndex(context.url)
      let fontIndex = getFontIndex(context.url)

      return context.render(
        <HomeShell
          me={getMe(designIndex)}
          designIndex={designIndex}
          fontIndex={fontIndex}
          bodyMix={HOME_BODY_STYLES[designIndex] ?? homePageOption1Body}
        />,
      )
    },

    preview(context) {
      let designIndex = getDesignIndex(context.url)
      let fontIndex = getFontIndex(context.url)
      let Design = HOME_DESIGNS[designIndex] ?? HomePageOption1Content

      return context.render(<Design me={getMe(designIndex)} designIndex={designIndex} fontIndex={fontIndex} />)
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
