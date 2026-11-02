import assert from "node:assert/strict"
import { test } from "node:test"

import config from "../cloudflare.config.ts"
import { sentryOptions } from "./sentry.ts"
import type { SentryBindings } from "./sentry.ts"

const present = "https://public@o0.ingest.sentry.io/1"

test("a missing DSN is the absent decision", () => {
  assert.equal(sentryOptions(undefined), undefined)
  assert.equal(sentryOptions({}), undefined)
  assert.equal(sentryOptions({ SENTRY_DSN: undefined }), undefined)
  assert.equal(sentryOptions({ SENTRY_DSN: "" }), undefined)
  assert.equal(sentryOptions({ SENTRY_DSN: "   " }), undefined)
  let nonString: SentryBindings = {}
  Object.assign(nonString, { SENTRY_DSN: 12 })
  assert.equal(sentryOptions(nonString), undefined)
})

test("a present DSN is error-only and matches the declared secret", () => {
  let declared = Object.entries(config.worker.env).some(
    ([name, binding]) => name === "SENTRY_DSN" && binding?.type === "secret",
  )
  assert.equal(declared, true)

  let options = sentryOptions({ SENTRY_DSN: `  ${present}  ` })
  assert.ok(options)
  assert.equal(options.dsn, present)
  assert.equal(options.tracesSampleRate, 0)
  assert.deepEqual(options.dataCollection, {
    userInfo: false,
    cookies: false,
    httpBodies: [],
  })
})
