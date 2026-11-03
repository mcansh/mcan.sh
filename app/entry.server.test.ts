import { getClient } from "@sentry/cloudflare"
import * as assert from "remix/assert"
import { Frame } from "remix/component"
import { jsx } from "remix/component/jsx-runtime"
import { test } from "remix/test"

import { stubEnv } from "../test/env.ts"

process.env.CLOUDINARY_CLOUD_NAME = "website-test"
process.env.PUBLIC_ORIGIN = "https://preview.example.com:8443"
process.env.SENTRY_REPORT_URL = "https://reports.example.com/csp"
delete process.env.SENTRY_DSN
delete process.env.VITE_SENTRY_DSN

const { default: workerAdapter, createWorker } = await import("./entry.server.tsx")
const { createApp } = await import("./router.tsx")
const { parseEnv } = await import("./utils/env.ts")

const bindings = {
  CLOUDINARY_CLOUD_NAME: "website-test",
  PUBLIC_ORIGIN: "https://preview.example.com:8443",
  SENTRY_REPORT_URL: "https://reports.example.com/csp",
  SENTRY_DSN: "https://public@ingest.example.com/123",
}
const config = parseEnv(bindings, "production")
const router = createApp(config)
const worker = createWorker(config, router)
const fetchWorker = worker.fetch

test("the worker fetch handler rewrites sitemap locations to the public origin", async () => {
  let response = await worker.fetch(
    new Request("http://internal.example:44100/sitemap.xml", {
      headers: {
        Host: "internal.example:44100",
        "X-Forwarded-Host": "untrusted.example",
        "X-Forwarded-Proto": "http",
      },
    }),
  )
  assert.equal(response.status, 200)
  let xml = await response.text()
  assert.ok(xml.includes("<loc>https://preview.example.com:8443/</loc>"))
  assert.ok(xml.includes("<loc>https://preview.example.com:8443/resume</loc>"))
  assert.ok(!xml.includes("internal.example") && !xml.includes("untrusted.example"))
})

test("a double-slash pathname cannot replace the public origin in the sitemap", async () => {
  let response = await worker.fetch(
    new Request("http://internal.example:44100//untrusted.example/sitemap.xml"),
  )
  assert.equal(response.status, 404)
  assert.ok(!(await response.text()).includes("<loc>https://untrusted.example/"))
})

test("caught server errors reach Sentry while the secured 500 response stays generic", async (t) => {
  let envelopes: string[] = []
  t.mock.method(globalThis, "fetch", async (_input: RequestInfo | URL, init: RequestInit) => {
    envelopes.push(String(init.body))
    return new Response("{}", { status: 200 })
  })
  let error = new Error("server-capture-test")
  let enabled: boolean | undefined
  let configuredDsn: string | undefined
  t.mock.method(router, "fetch", async () => {
    enabled = getClient()?.getOptions().enabled
    configuredDsn = getClient()?.getOptions().dsn
    throw error
  })
  t.mock.method(console, "error", () => {})
  let pending: Promise<unknown>[] = []
  let response: Response = await fetchWorker(
    new Request("https://mcan.sh/failure?private=value", {
      headers: { Cookie: "session=private", Authorization: "Bearer private" },
    }),
    bindings,
    {
      waitUntil(promise: Promise<unknown>) {
        pending.push(promise)
      },
      passThroughOnException() {},
    },
  )
  assert.equal(response.status, 500)
  assert.equal(await response.text(), "Internal Server Error")
  await Promise.all(pending)
  assert.equal(enabled, true)
  assert.equal(configuredDsn, config.SENTRY_DSN)
  assert.ok(pending.length > 0)
  assert.match(response.headers.get("Content-Security-Policy") ?? "", /report-to csp-endpoint/)
  assert.equal(
    response.headers.get("Reporting-Endpoints"),
    'csp-endpoint="https://reports.example.com/csp"',
  )
  assert.equal(envelopes.filter((body) => body.includes("server-capture-test")).length, 1)
  assert.ok(
    envelopes.every(
      (body) =>
        !body.includes("session=private") &&
        !body.includes("Bearer private") &&
        !body.includes("private=value"),
    ),
  )
})

test("streamed render errors reach Sentry before the request client is flushed", async (t) => {
  let envelopes: string[] = []
  t.mock.method(globalThis, "fetch", async (_input: RequestInfo | URL, init: RequestInit) => {
    envelopes.push(String(init.body))
    return new Response("{}", { status: 200 })
  })
  t.mock.method(console, "error", () => {})
  router.get("/__sentry-render-test", (context) =>
    context.render(
      jsx(Frame, {
        src: "/__sentry-failing-frame",
        fallback: jsx("p", { children: "Loading" }),
      }),
    ),
  )
  router.get("/__sentry-failing-frame", async () => {
    await new Promise((resolve) => setTimeout(resolve, 10))
    throw new Error("streamed-render-capture-test")
  })
  let pending: Promise<unknown>[] = []
  let response: Response = await fetchWorker(
    new Request("https://mcan.sh/__sentry-render-test"),
    bindings,
    {
      waitUntil(promise: Promise<unknown>) {
        pending.push(promise)
      },
      passThroughOnException() {},
    },
  )
  await response.text()
  await Promise.all(pending)
  assert.equal(envelopes.filter((body) => body.includes("streamed-render-capture-test")).length, 1)
})

test("a cancelled request does not report its abort reason to Sentry", async (t) => {
  let envelopes: string[] = []
  t.mock.method(globalThis, "fetch", async (_input: RequestInfo | URL, init: RequestInit) => {
    envelopes.push(String(init.body))
    return new Response("{}", { status: 200 })
  })
  let controller = new AbortController()
  let error = new Error("cancelled-request-test")
  controller.abort(error)
  t.mock.method(router, "fetch", async () => {
    throw error
  })
  let pending: Promise<unknown>[] = []
  let response: Response = await fetchWorker(
    new Request("https://mcan.sh/", { signal: controller.signal }),
    bindings,
    {
      waitUntil(promise: Promise<unknown>) {
        pending.push(promise)
      },
      passThroughOnException() {},
    },
  )
  await response.text()
  await Promise.all(pending)
  assert.ok(envelopes.every((body) => !body.includes("cancelled-request-test")))
})

test("the Worker adapter reads and reuses runtime bindings", async (t) => {
  stubEnv(t, "NODE_ENV", "test")
  let reads = 0
  let runtimeBindings = {
    ...bindings,
    get CLOUDINARY_CLOUD_NAME() {
      reads++
      return "runtime-bindings-test"
    },
  }
  let context = {
    waitUntil(_promise: Promise<unknown>) {},
    passThroughOnException() {},
  }
  for (let index = 0; index < 2; index++) {
    let response = await workerAdapter.fetch(
      new Request("https://mcan.sh/"),
      runtimeBindings,
      context,
    )
    assert.equal(response.status, 200)
    assert.match(
      response.headers.get("Content-Security-Policy") ?? "",
      /res\.cloudinary\.com\/runtime-bindings-test\/image\/upload\//,
    )
    assert.ok((await response.text()).includes("res.cloudinary.com/runtime-bindings-test/"))
  }
  assert.equal(reads, 1)
})
