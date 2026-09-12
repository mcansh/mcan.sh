import { asyncContext } from "remix/middleware/async-context"
import { render } from "remix/middleware/render"
import { staticFiles } from "remix/middleware/static"
import type { MiddlewareContext } from "remix/router"
import { createRouter } from "remix/router"

import controller from "./actions/controller.tsx"
import { assets } from "./assets.ts"
import { loadAssetEntry } from "./middleware/assets.ts"
import { securityHeaders } from "./middleware/security-headers.ts"
import { routes } from "./routes.ts"

const renderMiddleware = render({ assets })
type AppContext = MiddlewareContext<[typeof renderMiddleware]>

declare module "remix/router" {
  interface RouterTypes {
    context: AppContext
  }
}

export const router = createRouter<AppContext>({
  middleware: [
    securityHeaders(),
    asyncContext(),
    staticFiles("./public", { index: false, lastModified: true }),
    renderMiddleware,
    loadAssetEntry(),
  ],
})

router.map(routes, controller)
