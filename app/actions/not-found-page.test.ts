import assert from "node:assert/strict"
import { test } from "node:test"

import { routes } from "../routes.ts"

process.env.CLOUDINARY_CLOUD_NAME = "website-test"
delete process.env.PUBLIC_ORIGIN
delete process.env.SENTRY_REPORT_URL

const { router } = await import("../router.tsx")

test("missing pages offer recovery links and remain unindexed 404 responses", async () => {
  for (let path of ["/missing", "/preview?design=2"]) {
    let response = await router.fetch(new Request(`https://mcan.sh${path}`))
    assert.equal(response.status, 404, path)
    let html = await response.text()
    assert.match(html, /<h1[^>]*>Page not found\.?<\/h1>/)
    assert.match(html, /<meta name="robots" content="noindex, follow"/)
    assert.ok(html.includes(`href="${routes.home.href()}"`))
    assert.ok(html.includes(`href="${routes.resume.href()}"`))
    assert.match(html, /Back to home/)
    assert.match(html, /View résumé/)
  }
})
