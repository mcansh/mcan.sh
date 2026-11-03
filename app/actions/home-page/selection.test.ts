import * as assert from "remix/assert"
import { test } from "remix/test"

import { getIndex } from "./selection.ts"

test("selection query values become zero-based indices", () => {
  for (let max of [4, 5]) {
    for (let value = 1; value <= max; value++) {
      assert.equal(getIndex(String(value), max), value - 1)
    }
  }
})

test("missing and out-of-range selections default to the first option", () => {
  for (let value of [null, "", "invalid", "0", "-1", "6", "100"]) {
    assert.equal(getIndex(value, 5), 0)
  }
})
