import assert from "node:assert/strict"
import { test } from "node:test"

process.env.CLOUDINARY_CLOUD_NAME = "website-test"
delete process.env.PUBLIC_ORIGIN
delete process.env.SENTRY_REPORT_URL
delete process.env.SENTRY_DSN
delete process.env.VITE_SENTRY_DSN

const { getCanonicalHref, getPublicHref, getPublicOrigin } = await import("./public-origin.ts")

test("public origin uses the request origin when PUBLIC_ORIGIN is unset", () => {
  let request = new Request("https://preview.example.com:8443/resume?design=2")
  assert.equal(getPublicOrigin(request), "https://preview.example.com:8443")
  assert.equal(getPublicHref("/resume", request), "https://preview.example.com:8443/resume")
  assert.equal(getCanonicalHref(request), "https://preview.example.com:8443/resume")
})

test("canonical href keeps the path and drops search params", () => {
  assert.equal(
    getCanonicalHref(new Request("https://www.mcan.sh/?design=2&font=3")),
    "https://www.mcan.sh/",
  )
})
