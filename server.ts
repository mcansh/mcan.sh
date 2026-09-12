import * as http from "node:http"

import { createRequestListener } from "remix/node-fetch-server"

import { applySecurityHeaders } from "./app/middleware/security-headers.ts"
import { router } from "./app/router.ts"
import { env } from "./app/utils/env.ts"

const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 44100
const hmrProxyPort = process.env.HMR_PROXY_PORT
  ? Number.parseInt(process.env.HMR_PROXY_PORT, 10)
  : null

const publicOrigin = env.PUBLIC_ORIGIN ? new URL(env.PUBLIC_ORIGIN) : undefined

const server = http.createServer(
  createRequestListener(
    async (request) => {
      try {
        return await router.fetch(request)
      } catch (error) {
        if (!(request.signal.aborted && error === request.signal.reason)) console.error(error)
        return applySecurityHeaders(new Response("Internal Server Error", { status: 500 }), request)
      }
    },
    { host: publicOrigin?.host, protocol: publicOrigin?.protocol },
  ),
)

server.listen(port, () => {
  if (process.env.REMIX_NODE_HMR) {
    import("remix/node-hmr/runtime").then((nodeHmr) => nodeHmr.emitServerReady())
  }

  let address = server.address()
  let listeningPort = address instanceof Object ? address.port : port
  console.log(`Server listening on http://localhost:${hmrProxyPort ?? listeningPort}`)
})

let shuttingDown = false

function shutdown() {
  if (shuttingDown) {
    return
  }

  shuttingDown = true
  server.close(() => process.exit(0))
  server.closeAllConnections()
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
