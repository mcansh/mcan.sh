import assert from "node:assert/strict"
import { test } from "node:test"

process.env.CLOUDINARY_CLOUD_NAME = "website-test"
delete process.env.SENTRY_REPORT_URL
const { parseEnv } = await import("./env.ts")

test("production uses a configured public origin and rejects invalid values", () => {
  let input = {
    CLOUDINARY_CLOUD_NAME: "website-test",
    SENTRY_REPORT_URL: "https://reports.example.com/csp",
  }
  assert.equal(parseEnv(input, "production").PUBLIC_ORIGIN, "https://www.mcan.sh")
  assert.equal(parseEnv(input, "development").PUBLIC_ORIGIN, undefined)
  for (let value of [
    "https://example.com/path",
    "https://user:pass@example.com",
    "https://example.com/?x=1",
    "ftp://example.com",
  ]) {
    assert.throws(() => parseEnv({ ...input, PUBLIC_ORIGIN: value }, "production"))
  }
  assert.equal(
    parseEnv({ ...input, PUBLIC_ORIGIN: "https://preview.example.com:8443" }, "production")
      .PUBLIC_ORIGIN,
    "https://preview.example.com:8443",
  )
})
