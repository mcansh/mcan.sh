import { captureException, withSentry } from "@sentry/cloudflare"

import { applySecurityHeaders } from "./middleware/security-headers.ts"
import { router } from "./router.tsx"
import { env } from "./utils/env.ts"
import { applyPublicOrigin } from "./utils/public-origin.ts"

export default withSentry(
  () => ({
    dsn: env.SENTRY_DSN,
    enabled: process.env.NODE_ENV === "production" && Boolean(env.SENTRY_DSN),
    environment: process.env.NODE_ENV,
    isStreamingResponse: (response) =>
      response.headers.get("Content-Type")?.startsWith("text/html") ? true : undefined,
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
      urlQueryParams: false,
    },
  }),
  {
    async fetch(request: Request) {
      let incoming = applyPublicOrigin(request, env.PUBLIC_ORIGIN)
      try {
        return await router.fetch(incoming)
      } catch (error) {
        if (!(incoming.signal.aborted && error === incoming.signal.reason)) {
          captureException(error)
          console.error(error)
        }
        return applySecurityHeaders(
          new Response("Internal Server Error", { status: 500 }),
          incoming,
        )
      }
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept()
}
