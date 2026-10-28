import assert from "node:assert/strict"
import { test } from "node:test"

process.env.CLOUDINARY_CLOUD_NAME = "website-test"
delete process.env.PUBLIC_ORIGIN
delete process.env.SENTRY_REPORT_URL
delete process.env.SENTRY_DSN
delete process.env.VITE_SENTRY_DSN

const { applyPublicOrigin, getCanonicalHref, getPublicHref, getPublicOrigin } = await import("./public-origin.ts")

test("rewrites host and protocol to the configured origin and ignores forwarded headers", () => {
  let request = new Request("http://internal.example:8080/sitemap.xml?design=1", {
    headers: {
      Host: "internal.example:8080",
      "X-Forwarded-Host": "untrusted.example",
      "X-Forwarded-Proto": "http",
    },
  })
  let rewritten = applyPublicOrigin(request, "https://preview.example.com:8443")
  assert.equal(rewritten.url, "https://preview.example.com:8443/sitemap.xml?design=1")
  assert.equal(rewritten.headers.get("Host"), "internal.example:8080")
  assert.equal(rewritten.headers.get("X-Forwarded-Host"), "untrusted.example")
})

test("leaves the request unchanged when no public origin is configured", () => {
  let request = new Request("https://preview.example.com/sitemap.xml")
  assert.equal(applyPublicOrigin(request, undefined), request)
})

test("drops a non-default incoming port when the public origin uses the default port", () => {
  let rewritten = applyPublicOrigin(
    new Request("http://127.0.0.1:5173/sitemap.xml"),
    "https://mcan.sh",
  )
  assert.equal(rewritten.url, "https://mcan.sh/sitemap.xml")
})

test("keeps the configured origin when the incoming pathname starts with a double slash", () => {
  let rewritten = applyPublicOrigin(
    new Request("https://mcan.sh//untrusted.example/sitemap.xml"),
    "https://mcan.sh",
  )
  assert.equal(rewritten.url, "https://mcan.sh//untrusted.example/sitemap.xml")
})

test("does not throw when the incoming pathname is not a valid URL reference", () => {
  let rewritten = applyPublicOrigin(
    new Request("https://mcan.sh//%/sitemap.xml"),
    "https://mcan.sh",
  )
  assert.equal(rewritten.url, "https://mcan.sh//%/sitemap.xml")
})

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
