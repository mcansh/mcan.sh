import { captureException } from "@sentry/cloudflare"
import { asyncContext } from "remix/middleware/async-context"
import { render } from "remix/middleware/render"
import { staticFiles } from "remix/middleware/static"
import type { MiddlewareContext } from "remix/router"
import { createRouter } from "remix/router"

import controller from "./actions/controller.tsx"
import { assets } from "./assets.ts"
import { appConfig } from "./middleware/config.ts"
import { securityHeaders } from "./middleware/security-headers.ts"
import { routes } from "./routes.ts"
import { NotFoundPage } from "./ui/not-found-page.tsx"
import type { AppConfig } from "./utils/env.ts"
import { env } from "./utils/env.ts"

const renderMiddleware = render({
  assets,
  onError(error) {
    captureException(error)
    console.error(error)
  },
})
type AppContext = MiddlewareContext<[ReturnType<typeof appConfig>, typeof renderMiddleware]>

declare module "remix/router" {
  interface RouterTypes {
    context: AppContext
  }
}

export function createApp(config: AppConfig) {
  let router = createRouter<AppContext>({
    middleware: [
      appConfig(config),
      securityHeaders(config),
      asyncContext(),
      staticFiles("./public", { index: false, lastModified: true }),
      renderMiddleware,
    ],
    defaultHandler(context) {
      return context.render(<NotFoundPage />, { status: 404 })
    },
  })

  router.map(routes, controller)
  return router
}

export const router = createApp(env)
