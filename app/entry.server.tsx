import { _INTERNAL_wrapRequestHandler, withSentry } from "@sentry/cloudflare"

import { applySecurityHeaders } from "./middleware/security-headers.ts"
import { router } from "./router.ts"
import { reportServerError, sentryOptions } from "./sentry.ts"
import type { SentryBindings } from "./sentry.ts"
import { env as siteEnv } from "./utils/env.ts"
import { applyPublicOrigin } from "./utils/public-origin.ts"

const skippedSentryFetchMethods = new Set(["HEAD", "OPTIONS"])

type WorkerContext = {
  waitUntil(promise: Promise<unknown>): void
  passThroughOnException(): void
}

async function handleFetch(request: Request, env?: SentryBindings): Promise<Response> {
  let incoming = applyPublicOrigin(request, siteEnv.PUBLIC_ORIGIN)
  try {
    return await router.fetch(incoming)
  } catch (error) {
    if (!(incoming.signal.aborted && error === incoming.signal.reason)) {
      console.error(error)
      reportServerError(error)
    }
    return applySecurityHeaders(new Response("Internal Server Error", { status: 500 }), incoming)
  }
}

const handler = {
  async fetch(request: Request, env?: SentryBindings, ctx?: WorkerContext) {
    let options = sentryOptions(env)
    if (skippedSentryFetchMethods.has(request.method) && options !== undefined && ctx !== undefined) {
      return _INTERNAL_wrapRequestHandler({ options, request, context: ctx }, () => handleFetch(request, env))
    }
    return handleFetch(request, env)
  },
}

export default withSentry(sentryOptions, handler)

if (import.meta.hot) {
  import.meta.hot.accept()
}
