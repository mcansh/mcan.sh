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

test("Sentry is optional and a DSN supplies the default CSP reporting endpoint", () => {
  let input = { CLOUDINARY_CLOUD_NAME: "website-test" }
  assert.equal(parseEnv(input, "development").SENTRY_DSN, undefined)
  assert.equal(parseEnv({ ...input, SENTRY_DSN: "" }, "development").SENTRY_DSN, undefined)
  let configured = parseEnv(
    { ...input, SENTRY_DSN: "https://public@ingest.example.com/prefix/123" },
    "production",
  )
  assert.equal(configured.SENTRY_DSN, "https://public@ingest.example.com/prefix/123")
  assert.equal(
    configured.SENTRY_REPORT_URL,
    "https://ingest.example.com/prefix/api/123/security/?sentry_key=public",
  )
  assert.equal(
    parseEnv(
      {
        ...input,
        SENTRY_DSN: configured.SENTRY_DSN,
        SENTRY_REPORT_URL: "https://reports.example.com/csp",
      },
      "production",
    ).SENTRY_REPORT_URL,
    "https://reports.example.com/csp",
  )
  for (let dsn of [
    "not a URL",
    "ftp://public@ingest.example.com/123",
    "https://ingest.example.com/123",
    "https://public:private@ingest.example.com/123",
    "https://public@ingest.example.com/project",
    "https://public@ingest.example.com/123?query=1",
  ]) {
    assert.throws(() => parseEnv({ ...input, SENTRY_DSN: dsn }, "development"))
  }
  for (let reportUrl of [
    "ftp://reports.example.com/csp",
    "https://user@reports.example.com/csp",
    "https://reports.example.com/csp#fragment",
  ]) {
    assert.throws(() => parseEnv({ ...input, SENTRY_REPORT_URL: reportUrl }, "development"))
  }
  assert.equal(
    parseEnv({ ...input, SENTRY_REPORT_URL: 'https://reports.example.com/"unsafe' }, "development")
      .SENTRY_REPORT_URL,
    "https://reports.example.com/%22unsafe",
  )
})
