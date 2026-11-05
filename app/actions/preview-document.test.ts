import assert from "node:assert/strict"
import { test } from "node:test"

process.env.CLOUDINARY_CLOUD_NAME = "website-test"
delete process.env.PUBLIC_ORIGIN
delete process.env.SENTRY_REPORT_URL
delete process.env.SENTRY_DSN
delete process.env.VITE_SENTRY_DSN

const { router } = await import("../router.ts")

test("direct preview navigation is a noindex 404 canonicalized to the public homepage", async () => {
  let response = await router.fetch(new Request("https://www.mcan.sh/preview?design=2"))

  assert.equal(response.status, 404)
  assert.equal(response.headers.get("X-Robots-Tag"), "noindex")
  let html = await response.text()
  assert.ok(html.includes('<link rel="canonical" href="https://www.mcan.sh/">'))
  assert.ok(html.includes('<meta name="robots" content="noindex">'))
})
