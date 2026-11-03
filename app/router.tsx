import { captureException } from "@sentry/cloudflare"
import { asyncContext } from "remix/middleware/async-context"
import { render } from "remix/middleware/render"
import { staticFiles } from "remix/middleware/static"
import type { MiddlewareContext } from "remix/router"
import { createRouter } from "remix/router"

import controller from "./actions/controller.tsx"
import { assets } from "./assets.ts"
import { securityHeaders } from "./middleware/security-headers.ts"
import { routes } from "./routes.ts"
import { NotFoundPage } from "./ui/not-found-page.tsx"

const renderMiddleware = render({
  assets,
  onError(error) {
    captureException(error)
    console.error(error)
  },
})
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
  ],
  defaultHandler(context) {
    return context.render(<NotFoundPage />, { status: 404 })
  },
})

router.map(routes, controller)
