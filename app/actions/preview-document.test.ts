import assert from "node:assert/strict"
import { test } from "node:test"

process.env.CLOUDINARY_CLOUD_NAME = "website-test"
delete process.env.PUBLIC_ORIGIN
delete process.env.SENTRY_REPORT_URL
delete process.env.SENTRY_DSN
delete process.env.VITE_SENTRY_DSN

const { router } = await import("../router.ts")

test("direct preview navigation is a noindex 404 canonicalized to the preview path", async () => {
  for (let origin of ["https://www.mcan.sh", "https://mcan.sh"]) {
    let response = await router.fetch(new Request(`${origin}/preview?design=2`))

    assert.equal(response.status, 404, origin)
    assert.equal(response.headers.get("X-Robots-Tag"), "noindex", origin)
    let html = await response.text()
    assert.ok(html.includes(`<link rel="canonical" href="${origin}/preview"`), origin)
    assert.ok(html.includes('<meta name="robots" content="noindex, follow" />'), origin)
  }
})
