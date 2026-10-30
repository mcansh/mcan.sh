import * as assert from "remix/assert"
import { createTestServer } from "remix/node-fetch-server/test"
import { test } from "remix/test"

process.env.CLOUDINARY_CLOUD_NAME = "website-test"
delete process.env.SENTRY_REPORT_URL
const { router } = await import("../../router.ts")

test("picker navigation updates document styles and the selected font", async (t) => {
  let server = await createTestServer((request) => router.fetch(request))
  let page = await t.serve(server)
  await page.emulateMedia({ colorScheme: "dark" })
  await page.route("https://fonts.googleapis.com/**", (route) =>
    route.fulfill({ contentType: "text/css", body: "" }),
  )
  await page.goto("/?design=4")
  await page.getByRole("button", { name: "Show design and font options" }).click()
  await page.getByRole("link", { name: "1", exact: true }).click()
  await page.waitForURL("**/?design=1&font=1")
  await page.evaluate(() => window.navigation.transition?.finished)

  let documentStyles = () =>
    page.locator("html").evaluate((element) => {
      let style = getComputedStyle(element)
      return { height: style.height, minHeight: style.minHeight, background: style.backgroundColor }
    })
  let switchedStyles = await documentStyles()
  await page.reload()
  assert.deepEqual(switchedStyles, await documentStyles())

  await page.getByRole("button", { name: "Show design and font options" }).click()
  await page.getByRole("link", { name: "Geist", exact: true }).click()
  await page.waitForURL("**/?design=1&font=2")
  await page.evaluate(() => window.navigation.transition?.finished)
  await page.locator('link[rel="stylesheet"][href*="family=Geist"]').waitFor({ state: "attached" })
  assert.equal(
    await page
      .locator("html")
      .evaluate((element) => getComputedStyle(element).getPropertyValue("--font-sans").trim()),
    "Geist",
  )
})
