import * as assert from "remix/assert"
import { test } from "remix/test"

import { installPickerFontLoader } from "./public/picker-fonts.ts"

test("picker fonts load on interaction, deduplicate, and retry after a stylesheet error", async () => {
  let button = document.createElement("button")
  button.setAttribute("popovertarget", "design-font-picker")
  let picker = document.createElement("nav")
  picker.id = "design-font-picker"
  picker.popover = "auto"
  picker.dataset.pickerFonts = "data:text/css,body%7B%7D"
  let unrelated = document.createElement("input")
  document.body.append(button, picker, unrelated)
  installPickerFontLoader()

  let links = () =>
    document.querySelectorAll<HTMLLinkElement>('link[data-font-role="picker-preview"]')
  assert.equal(links().length, 0)
  unrelated.focus()
  assert.equal(links().length, 0)

  button.focus()
  assert.equal(links().length, 1)
  let firstLink = links()[0]
  assert.ok(firstLink)
  assert.equal(firstLink.href, picker.dataset.pickerFonts)

  button.dispatchEvent(new PointerEvent("pointerenter"))
  assert.equal(links().length, 1)
  assert.equal(links()[0], firstLink)

  firstLink.remove()
  button.dispatchEvent(new PointerEvent("pointerenter"))
  assert.equal(links().length, 1)
  let hoveredLink = links()[0]
  assert.ok(hoveredLink)
  hoveredLink.remove()

  let opened = new Promise<void>((resolve) =>
    picker.addEventListener("toggle", () => resolve(), { once: true }),
  )
  button.click()
  await opened
  assert.equal(links().length, 1)

  let failedLink = links()[0]
  assert.ok(failedLink)
  failedLink.dispatchEvent(new Event("error"))
  assert.equal(links().length, 0)
  button.dispatchEvent(new PointerEvent("pointerenter"))
  assert.equal(links().length, 1)
  let retriedLink = links()[0]
  assert.ok(retriedLink)
  assert.notEqual(retriedLink, failedLink)
  assert.equal(retriedLink.href, picker.dataset.pickerFonts)
})
