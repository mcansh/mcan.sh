import assert from "node:assert/strict"
import { test } from "node:test"

process.env.CLOUDINARY_CLOUD_NAME = "website-test"
delete process.env.PUBLIC_ORIGIN
delete process.env.SENTRY_REPORT_URL

const { DEFAULT_PUBLIC_ORIGIN, personUrl } = await import("./canonical-host.ts")

test("the public person url is the www origin with a trailing slash", () => {
  assert.equal(DEFAULT_PUBLIC_ORIGIN, "https://www.mcan.sh")
  assert.equal(personUrl(), "https://www.mcan.sh/")
})
