import type { Page } from "playwright"
import * as assert from "remix/assert"
import { createTestServer } from "remix/node-fetch-server/test"
import { test } from "remix/test"

process.env.CLOUDINARY_CLOUD_NAME = "website-test"
delete process.env.SENTRY_REPORT_URL
delete process.env.SENTRY_DSN
delete process.env.VITE_SENTRY_DSN

const { router } = await import("./router.ts")

test("preview clicks reconcile document styles and fonts like a fresh load", async (t) => {
  let server = await createTestServer((request) => router.fetch(request))
  let page = await t.serve(server)
  let freshServer = await createTestServer((request) => router.fetch(request))
  let fresh = await t.serve(freshServer)
  // Keep this test independent of external image and font services.
  for (let [testPage, baseUrl] of [
    [page, server.baseUrl],
    [fresh, freshServer.baseUrl],
  ] as const) {
    await testPage.route("**/*", (route) =>
      new URL(route.request().url()).origin === baseUrl
        ? route.continue()
        : route.fulfill({ status: 200, body: "" }),
    )
  }
  let errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto(`${server.baseUrl}/?design=1&font=2`)
  await ready(page)
  let originalDocument = await page.evaluateHandle(() => document)
  let initial = await documentStyles(page)

  for (let [label, destination] of [
    ["Next design", "/?design=2&font=2"],
    ["Next font →", "/?design=2&font=3"],
  ]) {
    await page.getByRole("button", { name: "Show design and font options" }).click()
    await page.getByRole("link", { name: label, exact: true }).click()
    await page.waitForURL(`${server.baseUrl}${destination}`)
    await fresh.goto(destination)
    await ready(fresh)
    let expected = await documentStyles(fresh)
    await page.waitForFunction(
      (expected) =>
        document.documentElement.className === expected.htmlClass &&
        document.querySelector('[data-rmx-key="fonts"]')?.textContent === expected.fontRules,
      expected,
    )
    assert.equal(await page.evaluate((original) => document === original, originalDocument), true)
    assert.deepEqual(await documentStyles(page), expected)
    if (label === "Next design") assert.notEqual(expected.htmlClass, initial.htmlClass)
    else {
      assert.notEqual(expected.fontRules, initial.fontRules)
      assert.notEqual(expected.fontLinks[0], initial.fontLinks[0])
    }
  }
  assert.deepEqual(errors, [])
})

async function ready(page: Page) {
  await page.evaluate(async () => {
    let entry = document.querySelector<HTMLScriptElement>('[data-rmx-key="browser-entry"]')!
    await import(entry.src)
  })
}

async function documentStyles(page: Page) {
  return page.evaluate(() => ({
    htmlClass: document.documentElement.className,
    htmlStyle: document.documentElement.getAttribute("style"),
    fontRules: document.querySelector('[data-rmx-key="fonts"]')?.textContent,
    fontLinks: [...document.querySelectorAll('[data-rmx-key="font-stylesheet"]')].map((link) =>
      link.getAttribute("href"),
    ),
    stylesheets: [...document.querySelectorAll("link[data-remix-stylesheet]")].map((link) =>
      link.getAttribute("href"),
    ),
    bodyFont: getComputedStyle(document.body).fontFamily,
    background: getComputedStyle(document.documentElement).backgroundColor,
  }))
}
