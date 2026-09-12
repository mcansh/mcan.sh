import assert from "node:assert/strict"
import { test } from "node:test"

process.env.CLOUDINARY_CLOUD_NAME = "website-test"
delete process.env.SENTRY_REPORT_URL
delete process.env.SENTRY_DSN
delete process.env.VITE_SENTRY_DSN

const { router } = await import("./router.ts")
const { parseEnv } = await import("./utils/env.ts")

test("CSP enforcement and startup work without any Sentry configuration", async () => {
  assert.doesNotThrow(() => parseEnv({ CLOUDINARY_CLOUD_NAME: "website-test" }))
  assert.equal(
    parseEnv({ CLOUDINARY_CLOUD_NAME: "website-test", SENTRY_REPORT_URL: "" }).SENTRY_REPORT_URL,
    undefined,
  )
  assert.throws(() =>
    parseEnv({ CLOUDINARY_CLOUD_NAME: "website-test", SENTRY_REPORT_URL: "not a URL" }),
  )
  let response = await router.fetch("https://mcan.sh/")
  assert.equal(response.status, 200)
  let csp = response.headers.get("Content-Security-Policy")!
  assert.match(csp, /default-src 'none'/)
  assert.doesNotMatch(csp, /report-uri|undefined/)
  await response.body?.cancel()
})
