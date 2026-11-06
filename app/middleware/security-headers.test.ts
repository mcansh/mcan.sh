import assert from "node:assert/strict"
import { test } from "node:test"

process.env.CLOUDINARY_CLOUD_NAME = "security-test"
process.env.SENTRY_REPORT_URL = "https://reports.example.com/csp"
process.env.SENTRY_DSN = "https://public@ingest.example.com/123"

const { createApp } = await import("../router.tsx")
const { parseEnv } = await import("../utils/env.ts")
const { applySecurityHeaders } = await import("./security-headers.ts")

const config = parseEnv(
  {
    CLOUDINARY_CLOUD_NAME: "security-test",
    SENTRY_REPORT_URL: "https://reports.example.com/csp",
    SENTRY_DSN: "https://public@ingest.example.com/123",
  },
  "test",
)
const router = createApp(config)

function assertPolicy(response: Response) {
  assert.equal(response.headers.get("X-Frame-Options"), "DENY")
  assert.equal(response.headers.get("X-Content-Type-Options"), "nosniff")
  assert.equal(response.headers.get("Referrer-Policy"), "same-origin")
  let hsts = response.headers.get("Strict-Transport-Security")
  assert.ok(hsts)
  assert.match(hsts, /max-age=/)
  let permissions = response.headers.get("Permissions-Policy")
  assert.ok(permissions)
  assert.match(permissions, /camera=\(\)/)
  let csp = response.headers.get("Content-Security-Policy")
  assert.ok(csp)
  assert.ok(csp.includes("report-uri https://reports.example.com/csp"))
  assert.match(csp, /report-to csp-endpoint/)
  assert.equal(
    response.headers.get("Reporting-Endpoints"),
    'csp-endpoint="https://reports.example.com/csp"',
  )
  assert.match(csp, /connect-src [^;]*https:\/\/ingest\.example\.com/)
  assert.doesNotMatch(csp, /public@/)
  assert.match(csp, /default-src 'none'/)
  assert.match(csp, /frame-ancestors 'none'/)
  assert.match(csp, /script-src 'self' 'nonce-[^']+' 'strict-dynamic'/)
  assert.doesNotMatch(csp.split("script-src ")[1].split(";")[0], /'unsafe-inline'|'unsafe-eval'/)
  return csp
}

test("router protects documents, static files, and missing routes", async () => {
  let document = await router.fetch("https://mcan.sh/")
  assert.equal(document.status, 200)
  let csp = assertPolicy(document)
  let html = await document.text()
  let nonceMatch = csp.match(/'nonce-([^']+)'/)
  assert.ok(nonceMatch)
  let nonce = nonceMatch[1]
  let scripts = [...html.matchAll(/<script\b[^>]*>/gi)].map(([tag]) => tag)
  assert.ok(scripts.some((tag) => tag.includes('type="importmap"')))
  assert.ok(scripts.some((tag) => tag.includes('type="module"')))
  for (let script of scripts) {
    if (!script.includes('type="application/json"'))
      assert.ok(script.includes(`nonce="${nonce}"`), script)
  }
  assert.match(csp, /style-src 'self' 'unsafe-inline' https:\/\/fonts\.googleapis\.com/)
  assert.match(csp, /font-src 'self' https:\/\/fonts\.gstatic\.com/)
  assert.match(csp, /https:\/\/res\.cloudinary\.com\/security-test\/image\/upload\//)
  assert.match(html, /data-rmx-style/)
  let entryMatch = html.match(/<script[^>]+src="([^"]+)"/i)
  assert.ok(entryMatch)
  assert.match(entryMatch[1], /^\/test-entry\.js$/)
  assert.match(html, /href="\/test-global\.css"/)
  for (let [path, status] of [
    ["/favicon.svg", 200],
    ["/missing", 404],
    ["/manifest.json", 200],
  ] as const) {
    let response = await router.fetch(new URL(path, "https://mcan.sh"))
    assert.equal(response.status, status, path)
    assertPolicy(response)
    await response.body?.cancel()
  }
  let second = await router.fetch("https://mcan.sh/?font=5&design=4")
  assertPolicy(second)
  assert.notEqual(second.headers.get("Content-Security-Policy"), csp)
  assert.match(await second.text(), /Space\+Grotesk/)
})

test("preserves immutable redirects, cookies, cache metadata, bodies, and error status", async () => {
  let request = new Request("https://mcan.sh/")
  let redirect = applySecurityHeaders(
    Response.redirect("https://mcan.sh/resume", 302),
    request,
    config,
  )
  assert.equal(redirect.status, 302)
  assert.equal(redirect.headers.get("Location"), "https://mcan.sh/resume")
  assertPolicy(redirect)
  let headers = new Headers({ "Cache-Control": "private", ETag: '"version"' })
  headers.append("Set-Cookie", "a=1; HttpOnly")
  headers.append("Set-Cookie", "b=2; HttpOnly")
  let response = applySecurityHeaders(
    new Response("Internal Server Error", { status: 500, statusText: "Failure", headers }),
    request,
    config,
  )
  assertPolicy(response)
  assert.equal(response.status, 500)
  assert.equal(response.statusText, "Failure")
  assert.equal(response.headers.get("Cache-Control"), "private")
  assert.equal(response.headers.get("ETag"), '"version"')
  assert.deepEqual(response.headers.getSetCookie(), headers.getSetCookie())
  assert.equal(await response.text(), "Internal Server Error")
  assert.equal(
    applySecurityHeaders(new Response(null, { status: 304 }), request, config).body,
    null,
  )
})

test("production upgrade policy excludes only loopback hosts and dev connections stay dev-only", () => {
  let productionConfig = { ...config, mode: "production" }
  for (let host of ["mcan.sh", "localhost.evil.example"]) {
    let csp = assertPolicy(
      applySecurityHeaders(new Response(), new Request(`http://${host}/`), productionConfig),
    )
    assert.match(csp, /upgrade-insecure-requests/)
    assert.doesNotMatch(csp, /wss?:/)
  }
  for (let host of ["localhost:44100", "127.0.0.1:44100", "[::1]:44100"]) {
    let csp = assertPolicy(
      applySecurityHeaders(new Response(), new Request(`http://${host}/`), productionConfig),
    )
    assert.doesNotMatch(csp, /upgrade-insecure-requests/)
  }
  let developmentConfig = { ...config, mode: "development" }
  let csp = assertPolicy(
    applySecurityHeaders(new Response(), new Request("http://localhost/"), developmentConfig),
  )
  assert.match(csp, /connect-src 'self' ws: wss:/)
  assert.doesNotMatch(csp, /upgrade-insecure-requests/)
})
