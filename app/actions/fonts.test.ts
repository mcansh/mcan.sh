import assert from "node:assert/strict"
import { test } from "node:test"

import {
  bodyFontStylesheetUrl,
  cssFontFamilyValue,
  FONT_CONFIGS,
  fontConfigAt,
  pickerPreviewStylesheetUrl,
} from "./fonts.ts"

test("body stylesheets load only the selected variable font without a text subset", () => {
  for (let [, family] of FONT_CONFIGS) {
    let url = new URL(bodyFontStylesheetUrl(family))
    assert.equal(url.origin, "https://fonts.googleapis.com")
    assert.equal(url.pathname, "/css2")
    assert.deepEqual(url.searchParams.getAll("family"), [`${family}:wght@400..700`])
    assert.equal(url.searchParams.get("display"), "swap")
    assert.equal(url.searchParams.has("text"), false)
  }
})

test("picker stylesheets load every inactive family at preview weight", () => {
  for (let [, activeFamily] of FONT_CONFIGS) {
    let url = new URL(pickerPreviewStylesheetUrl(activeFamily))
    assert.equal(url.origin, "https://fonts.googleapis.com")
    assert.equal(url.pathname, "/css2")
    assert.equal(url.searchParams.get("display"), "swap")
    assert.deepEqual(
      url.searchParams.getAll("family").sort(),
      FONT_CONFIGS.filter(([, family]) => family !== activeFamily)
        .map(([, family]) => `${family}:wght@400`)
        .sort(),
    )

    let text = url.searchParams.get("text")
    assert.ok(text)
    let expectedCharacters = new Set(FONT_CONFIGS.map(([name]) => name).join(""))
    assert.deepEqual(new Set(text), expectedCharacters)
    assert.equal(text.length, expectedCharacters.size)
  }
})

test("font configuration defaults to Inter and quotes family names for CSS", () => {
  assert.equal(fontConfigAt(0)[1], "Inter")
  assert.equal(fontConfigAt(99)[1], "Inter")
  assert.equal(cssFontFamilyValue("Instrument Sans"), "'Instrument Sans', var(--font-sans)")
})
