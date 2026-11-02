import assert from "node:assert/strict"
import { test } from "node:test"

process.env.CLOUDINARY_CLOUD_NAME = "website-test"
process.env.PUBLIC_ORIGIN = "https://preview.example.com:8443"
process.env.SENTRY_REPORT_URL = "https://reports.example.com/csp"
delete process.env.SENTRY_DSN
delete process.env.VITE_SENTRY_DSN

const worker = await import("./entry.server.tsx")

test("the worker fetch handler rewrites sitemap locations to the public origin", async () => {
  let response = await worker.default.fetch(
    new Request("http://internal.example:5173/sitemap.xml", {
      headers: {
        Host: "internal.example:5173",
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
  let response = await worker.default.fetch(
    new Request("http://internal.example:5173//untrusted.example/sitemap.xml"),
  )
  assert.equal(response.status, 404)
  assert.ok(!(await response.text()).includes("<loc>https://untrusted.example/"))
})
