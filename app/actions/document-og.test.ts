import assert from "node:assert/strict"
import { test } from "node:test"

process.env.CLOUDINARY_CLOUD_NAME = "website-test"
delete process.env.SENTRY_REPORT_URL
delete process.env.SENTRY_DSN
delete process.env.VITE_SENTRY_DSN

const { router } = await import("../router.ts")

test("home and resume name the Open Graph card and its 1200 by 630 size", async () => {
  for (let path of ["/", "/resume"]) {
    let response = await router.fetch(`https://mcan.sh${path}`)
    assert.equal(response.status, 200, path)
    let html = await response.text()
    let headMatch = html.match(/<head>([\s\S]*?)<\/head>/)
    assert.ok(headMatch, path)
    let head = headMatch[1]
    assert.match(head, /<meta property="og:image:width" content="1200"/)
    assert.match(head, /<meta property="og:image:height" content="630"/)
    assert.match(head, /<meta property="og:image:alt" content="Logan McAnsh"/)
  }
})
