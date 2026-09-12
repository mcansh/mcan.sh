import assert from "node:assert/strict"
import { test } from "node:test"

process.env.CLOUDINARY_CLOUD_NAME = "website-test"
delete process.env.SENTRY_REPORT_URL
delete process.env.SENTRY_DSN
delete process.env.VITE_SENTRY_DSN

const { router } = await import("./router.ts")
const { parseEnv } = await import("./utils/env.ts")

test("every homepage design renders numeric image dimensions and search metadata", async () => {
  for (let design = 1; design <= 4; design++) {
    let response = await router.fetch(`https://mcan.sh/?design=${design}`)
    assert.equal(response.status, 200)
    let html = await response.text()
    let head = html.match(/<head>([\s\S]*?)<\/head>/)![1]!
    assert.match(head, /<meta name="description" content="personal website for Logan McAnsh"/)
    let data = JSON.parse(
      head.match(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)![1]!,
    )
    assert.equal(data["@type"], "Person")
    assert.equal(data.name, "Logan McAnsh")
    assert.equal(data.url, "https://mcan.sh")
    assert.equal(data.jobTitle, "Senior Software Engineer")
    assert.ok(data.sameAs.includes("https://linkedin.com/in/loganmcansh"))
    let image = html.match(/<img[^>]+alt="Logan McAnsh"[^>]*>/)![0]
    assert.match(image, design === 2 ? /width="224"/ : /width="480"/)
    assert.match(image, design === 2 ? /height="624"/ : /height="480"/)
    if (design === 2) {
      let srcSet = image.match(/srcset="([^"]+)"/)![1]!
      let candidates = srcSet.split(/, (?=https:)/)
      assert.equal(candidates.length, 2)
      assert.match(candidates[0]!, /c_fill/)
      assert.match(candidates[0]!, /h_624/)
      assert.match(candidates[0]!, /w_224/)
      assert.match(candidates[0]!, / 1x$/)
      assert.match(candidates[1]!, /h_1248/)
      assert.match(candidates[1]!, /w_448/)
      assert.match(candidates[1]!, / 2x$/)
      assert.ok(data.image.includes("h_624"))
    }
    assert.ok(data.image.includes("res.cloudinary.com/website-test/"))
    assert.doesNotMatch(html, /loganmcanish/)
    if (design === 2 || design === 3)
      assert.match(html, /href="https:\/\/linkedin.com\/in\/loganmcansh"/)
  }
})

test("read-only pages accept GET and HEAD and reject write methods", async () => {
  for (let path of ["/", "/resume"]) {
    for (let method of ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"]) {
      let response = await router.fetch(new Request(`https://mcan.sh${path}`, { method }))
      let read = method === "GET" || method === "HEAD"
      assert.equal(response.status, read ? 200 : 405, `${method} ${path}`)
      if (!read) assert.match(response.headers.get("Allow")!, /GET/)
      if (method === "HEAD") assert.equal(response.body, null)
      await response.body?.cancel()
    }
  }
})

test("CSP enforcement and startup work without any Sentry configuration", async () => {
  assert.doesNotThrow(() => parseEnv({ CLOUDINARY_CLOUD_NAME: "website-test" }))
  assert.equal(
    parseEnv({ CLOUDINARY_CLOUD_NAME: "website-test", SENTRY_REPORT_URL: "" }).SENTRY_REPORT_URL,
    undefined,
  )
  assert.throws(() =>
    parseEnv({ CLOUDINARY_CLOUD_NAME: "website-test", SENTRY_REPORT_URL: "not a URL" }),
  )
  let response = await router.fetch("https://mcan.sh/")
  assert.equal(response.status, 200)
  let csp = response.headers.get("Content-Security-Policy")!
  assert.match(csp, /default-src 'none'/)
  assert.doesNotMatch(csp, /report-uri|undefined/)
  await response.body?.cancel()
})
