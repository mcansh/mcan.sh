import { createController } from "remix/router"

import { assets } from "../assets.ts"
import { routes } from "../routes.ts"
import { getMugshotURL } from "../utils/cloudinary.ts"
import { env } from "../utils/env.ts"
import { HomePage } from "./home-page.tsx"

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

      return context.render(
        <HomePage
          me={{
            url: me.url.toString(),
            size: me.size,
            srcSet: srcSet.map((x) => `${x.url} ${x.density}x`).join(", "),
          }}
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
