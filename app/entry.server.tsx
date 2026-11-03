import { captureException, withSentry } from "@sentry/cloudflare"
import type { InferEnv, UnwrapConfig } from "cf/config"
import { ContentType } from "remix/headers/content-type"

import type cloudflareConfig from "../cloudflare.config.ts"
import { applySecurityHeaders } from "./middleware/security-headers.ts"
import { createApp } from "./router.tsx"
import type { AppConfig } from "./utils/env.ts"
import { parseEnv } from "./utils/env.ts"
import { applyPublicOrigin } from "./utils/public-origin.ts"

type WorkerConfig = UnwrapConfig<UnwrapConfig<typeof cloudflareConfig>["worker"]>
type WorkerBindings = InferEnv<WorkerConfig>

interface WorkerContext {
  waitUntil(promise: Promise<unknown>): void
  passThroughOnException(): void
}

export function createWorker(config: AppConfig, app = createApp(config)) {
  return withSentry(
    () => ({
      dsn: config.SENTRY_DSN,
      enabled: config.mode === "production" && Boolean(config.SENTRY_DSN),
      environment: config.mode,
      isStreamingResponse: (response) => {
        let contentType = ContentType.from(response.headers.get("Content-Type"))
        return contentType.mediaType === "text/html" ? true : undefined
      },
      dataCollection: {
        userInfo: false,
        cookies: false,
        httpHeaders: false,
        httpBodies: [],
        urlQueryParams: false,
      },
    }),
    {
      async fetch(request: Request, _bindings?: WorkerBindings, _context?: WorkerContext) {
        let incoming = applyPublicOrigin(request, config.PUBLIC_ORIGIN)
        try {
          return await app.fetch(incoming)
        } catch (error) {
          if (!(incoming.signal.aborted && error === incoming.signal.reason)) {
            captureException(error)
            console.error(error)
          }
          return applySecurityHeaders(
            new Response("Internal Server Error", { status: 500 }),
            incoming,
            config,
          )
        }
      },
    },
  )
}

const workers = new WeakMap<WorkerBindings, ReturnType<typeof createWorker>>()

export default {
  async fetch(request: Request, bindings: WorkerBindings, context: WorkerContext) {
    let worker = workers.get(bindings)
    if (worker === undefined) {
      worker = createWorker(parseEnv({ ...bindings }, process.env.NODE_ENV || "development"))
      workers.set(bindings, worker)
    }
    return worker.fetch(request, bindings, context)
  },
}

if (import.meta.hot) {
  import.meta.hot.accept()
}
