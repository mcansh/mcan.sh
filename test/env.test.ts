import * as assert from "remix/assert"
import { afterEach, describe, test } from "remix/test"

import { stubEnv, unstubAllEnv } from "./env.ts"

const originalEnvironment = process.env
const key = "MCAN_ENV_UTILITY_TEST"

describe("test environment stubs", () => {
  afterEach(() => {
    assert.equal(process.env, originalEnvironment)
  })

  test("sets values without mutating the original environment", (t) => {
    let originalValue = originalEnvironment[key]
    stubEnv(t, key, "stubbed")
    assert.equal(process.env[key], "stubbed")
    assert.notEqual(process.env, originalEnvironment)
    assert.equal(originalEnvironment[key], originalValue)
  })

  test("supports repeated stubs, empty strings, and removing variables", (t) => {
    stubEnv(t, key, "first")
    stubEnv(t, key, "second")
    assert.equal(process.env[key], "second")
    stubEnv(t, key, "")
    assert.equal(process.env[key], "")
    stubEnv(t, key, undefined)
    assert.equal(Object.hasOwn(process.env, key), false)
    assert.equal(process.env[key], undefined)
  })

  test("restores multiple variables immediately", (t) => {
    let originalPath = originalEnvironment.PATH
    let originalValue = originalEnvironment[key]
    stubEnv(t, "PATH", "stubbed-path")
    stubEnv(t, key, "stubbed")
    unstubAllEnv(t)
    assert.equal(process.env, originalEnvironment)
    assert.equal(process.env.PATH, originalPath)
    assert.equal(process.env[key], originalValue)
  })

  test("automatically restores a new stub after an explicit restore", (t) => {
    stubEnv(t, key, "first")
    unstubAllEnv(t)
    stubEnv(t, key, "second")
    assert.equal(process.env[key], "second")
  })

  test("restoring before stubbing or more than once is harmless", (t) => {
    unstubAllEnv(t)
    stubEnv(t, key, "stubbed")
    unstubAllEnv(t)
    unstubAllEnv(t)
    assert.equal(process.env, originalEnvironment)
  })
})
