import { applySecurityHeaders } from "./middleware/security-headers.ts"
import { router } from "./router.ts"
import { env } from "./utils/env.ts"
import { applyPublicOrigin } from "./utils/public-origin.ts"

export default {
  async fetch(request: Request) {
    let incoming = applyPublicOrigin(request, env.PUBLIC_ORIGIN)
    try {
      return await router.fetch(incoming)
    } catch (error) {
      if (!(incoming.signal.aborted && error === incoming.signal.reason)) console.error(error)
      return applySecurityHeaders(new Response("Internal Server Error", { status: 500 }), incoming)
    }
  },
}

if (import.meta.hot) {
  import.meta.hot.accept()
}
