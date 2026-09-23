import assert from "node:assert/strict"
import { after, before, test } from "node:test"

import Cloudflare from "cloudflare"
import { PDF } from "cloudflare/resources/browser-rendering/pdf"
import { render } from "remix/middleware/render"
import { createRouter } from "remix/router"

const originalEnv = { ...process.env }

before(() => {
  process.env.CLOUDINARY_CLOUD_NAME = "resume-test"
  process.env.CLOUDFLARE_ACCOUNT_ID = "test-account"
  process.env.CLOUDFLARE_API_TOKEN = "test-token"
  process.env.PUBLIC_ORIGIN = "https://mcan.sh"
})

after(() => {
  process.env = originalEnv
})

test("PDF requests share a render and cache, expire, and recover after failures", async (t) => {
  let { resume } = await import("./controller.tsx")
  let { routes } = await import("../../routes.ts")
  let now = 1_000
  t.mock.method(Date, "now", () => now)
  let calls = 0
  let finish = Promise.withResolvers<Response>()
  t.mock.method(PDF.prototype, "create", async (params: { url: string }) => {
    calls++
    assert.equal(params.url, "https://mcan.sh/resume")
    return finish.promise
  })
  let router = createRouter({ middleware: [render()] })
  router.map(routes.resume, resume)
  let request = (query = "") => router.fetch(`https://mcan.sh/resume.pdf${query}`)
  let first = request("?v=1")
  let second = request("?v=2")
  await new Promise((resolve) => setImmediate(resolve))
  assert.equal(calls, 1)
  finish.resolve(new Response("pdf-one", { headers: { "Content-Type": "application/pdf" } }))
  let responses = await Promise.all([first, second])
  assert.deepEqual(await Promise.all(responses.map((response) => response.text())), [
    "pdf-one",
    "pdf-one",
  ])
  let cached = await request("?v=3")
  assert.equal(await cached.text(), "pdf-one")
  assert.equal(cached.headers.get("Content-Type"), "application/pdf")
  assert.match(cached.headers.get("Cache-Control")!, /s-maxage=3600/)
  assert.equal(calls, 1)

  now += 60 * 60 * 1000
  finish = Promise.withResolvers<Response>()
  let providerError = new Cloudflare.InternalServerError(
    503,
    { errors: [{ code: 1000, message: "Renderer unavailable" }] },
    "Renderer unavailable",
    new Headers(),
  )
  let providerFailure = assert.rejects(request(), (error) => error === providerError)
  finish.reject(providerError)
  await providerFailure
  assert.equal(calls, 2)

  finish = Promise.withResolvers<Response>()
  let failed = request()
  let rejected = assert.rejects(failed, /render failed/)
  finish.reject(new Error("render failed"))
  await rejected
  assert.equal(calls, 3)

  finish = Promise.withResolvers<Response>()
  finish.resolve(new Response("pdf-two"))
  assert.equal(await (await request()).text(), "pdf-two")
  assert.equal(await (await request("?fresh=1")).text(), "pdf-two")
  assert.equal(calls, 4)
})

test("missing either Cloudflare credential returns 401 without rendering", async (t) => {
  let { resume } = await import("./controller.tsx")
  let { routes } = await import("../../routes.ts")
  let { env } = await import("../../utils/env.ts")
  let credentials = {
    CLOUDFLARE_ACCOUNT_ID: env.CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_API_TOKEN: env.CLOUDFLARE_API_TOKEN,
  }
  t.after(() => Object.assign(env, credentials))
  let renderPdf = t.mock.method(PDF.prototype, "create", () => {
    assert.fail("Missing credentials must not invoke Cloudflare")
  })
  let router = createRouter({ middleware: [render()] })
  router.map(routes.resume, resume)

  for (let key of ["CLOUDFLARE_ACCOUNT_ID", "CLOUDFLARE_API_TOKEN"] as const) {
    Object.assign(env, credentials)
    env[key] = undefined
    let response = await router.fetch("https://mcan.sh/resume.pdf")
    assert.equal(response.status, 401)
    assert.equal(await response.text(), "Unauthorized")
  }
  assert.equal(renderPdf.mock.callCount(), 0)
})
