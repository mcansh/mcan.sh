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
    assert.equal(response.headers.get("Cross-Origin-Embedder-Policy"), "require-corp")
    let html = await response.text()
    assert.match(html, /<button[^>]+popovertarget="design-font-picker"/)
    assert.match(html, /<nav[^>]+id="design-font-picker"[^>]+popover="auto"/)
    assert.doesNotMatch(html, /<details|<summary/)
    let head = html.match(/<head>([\s\S]*?)<\/head>/)![1]!
    assert.match(head, /<meta name="description" content="personal website for Logan McAnsh"/)
    let data = JSON.parse(
      head.match(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i)![1]!,
    )
    assert.equal(data["@type"], "Person")
    assert.equal(data.name, "Logan McAnsh")
    assert.equal(data.url, "https://mcan.sh")
    assert.equal(data.jobTitle, "Senior Software Engineer")
    assert.deepEqual(data.sameAs, [
      "https://github.com/mcansh",
      "https://linkedin.com/in/loganmcansh",
      "https://x.com/loganmcansh",
    ])
    let image = html.match(/<img[^>]+alt="Logan McAnsh"[^>]*>/)![0]
    assert.match(image, /crossorigin="anonymous"/)
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
      assert.match(html, /href="https:\/\/linkedin\.com\/in\/loganmcansh"/)
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

test("non-production CSP enforcement and startup work without Sentry configuration", async () => {
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

test("production requires a valid CSP reporting URL", () => {
  for (let reportUrl of [undefined, "", "not a URL"]) {
    assert.throws(() =>
      parseEnv(
        { CLOUDINARY_CLOUD_NAME: "website-test", SENTRY_REPORT_URL: reportUrl },
        "production",
      ),
    )
  }
  let reportUrl = "https://reports.example.com/csp"
  assert.equal(
    parseEnv({ CLOUDINARY_CLOUD_NAME: "website-test", SENTRY_REPORT_URL: reportUrl }, "production")
      .SENTRY_REPORT_URL,
    reportUrl,
  )
  for (let nodeEnv of ["development", "test"]) {
    assert.doesNotThrow(() => parseEnv({ CLOUDINARY_CLOUD_NAME: "website-test" }, nodeEnv))
  }
})

test("manifest aliases serve existing icons and support conditional requests", async () => {
  let first = await router.fetch("https://mcan.sh/manifest.webmanifest")
  assert.equal(first.status, 200)
  assert.match(first.headers.get("Content-Type")!, /^application\/manifest\+json/)
  assert.equal(first.headers.get("Cache-Control"), "public, max-age=60, must-revalidate")
  let etag = first.headers.get("ETag")!
  let content = await first.text()
  let manifest = JSON.parse(content)
  assert.equal(manifest.name, "Logan McAnsh")
  assert.equal(manifest.start_url, "/?homescreen=1")
  assert.equal(manifest.display, "standalone")
  assert.equal(manifest.theme_color, "#e53a40")
  for (let icon of manifest.icons) {
    let response = await router.fetch(
      new Request(new URL(icon.src, "https://mcan.sh"), { method: "HEAD" }),
    )
    assert.equal(response.status, 200, icon.src)
    assert.match(response.headers.get("Content-Type")!, /image\/png/)
  }
  let alias = await router.fetch("https://mcan.sh/manifest.json")
  assert.equal(await alias.text(), content)
  assert.equal(alias.headers.get("ETag"), etag)
  for (let condition of [etag, etag.slice(2), `"old", ${etag}`, "*"]) {
    let cached = await router.fetch(
      new Request("https://mcan.sh/manifest.webmanifest", {
        headers: { "If-None-Match": condition },
      }),
    )
    assert.equal(cached.status, 304)
    assert.equal(cached.body, null)
    assert.equal(cached.headers.get("ETag"), etag)
    assert.equal(cached.headers.get("Cache-Control"), first.headers.get("Cache-Control"))
    assert.ok(cached.headers.has("Content-Security-Policy"))
  }
  let stale = await router.fetch(
    new Request("https://mcan.sh/manifest.json", { headers: { "If-None-Match": '"stale"' } }),
  )
  assert.equal(stale.status, 200)
  await stale.body?.cancel()
  let homepage = await router.fetch("https://mcan.sh/")
  assert.match(await homepage.text(), /<link rel="manifest" href="\/manifest.webmanifest"/)
})

test("sitemap lists the homepage and resume on the request origin", async () => {
  let response = await router.fetch("https://preview.example.com/sitemap.xml")
  assert.equal(response.status, 200)
  assert.match(response.headers.get("Content-Type")!, /application\/xml/)
  assert.equal(response.headers.get("Cache-Control"), "public, max-age=3600")
  let xml = await response.text()
  assert.ok(xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'))
  assert.ok(xml.includes("<loc>https://preview.example.com/</loc>"))
  assert.ok(xml.includes("<loc>https://preview.example.com/resume</loc>"))
  assert.equal([...xml.matchAll(/<url>/g)].length, 2)
})

test("restored resource routes support HEAD, reject writes, and return 404 for unknown well-known paths", async () => {
  for (let path of ["/manifest.json", "/manifest.webmanifest", "/sitemap.xml"]) {
    let response = await router.fetch(new Request(`https://mcan.sh${path}`, { method: "HEAD" }))
    assert.equal(response.status, 200)
    assert.equal(response.body, null)
  }
  for (let path of [
    "/manifest.json",
    "/manifest.webmanifest",
    "/sitemap.xml",
    "/.well-known/avatar",
  ]) {
    let response = await router.fetch(new Request(`https://mcan.sh${path}`, { method: "POST" }))
    assert.equal(response.status, 405)
    await response.body?.cancel()
  }
  for (let path of ["/.well-known/", "/.well-known/security.txt", "/.well-known/avatar/extra"]) {
    let response = await router.fetch(`https://mcan.sh${path}`)
    assert.equal(response.status, 404)
    await response.body?.cancel()
  }
})

test("well-known avatar forwards transformations, cancellation, and the image response", async () => {
  let { createWellKnownResponse } = await import("./actions/well-known.ts")
  let { createRouter } = await import("remix/router")
  let { routes } = await import("./routes.ts")
  for (let path of ["avatar", "w_48/h_48/c_fill/avatar"]) {
    let request = new Request(`https://mcan.sh/.well-known/${path}`)
    let upstream = new Response(new Uint8Array([1, 2, 3]), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=60",
        ETag: '"image"',
      },
    })
    let avatarRouter = createRouter()
    avatarRouter.get(routes.wellKnownAvatar, (context) =>
      createWellKnownResponse(context.params.path, context.request, async (input, init) => {
        assert.ok(input instanceof URL)
        assert.equal(input.origin, "https://res.cloudinary.com")
        assert.ok(input.pathname.startsWith("/website-test/image/upload/"))
        assert.ok(input.pathname.endsWith("/website/2498016352165139482"))
        assert.ok(input.pathname.includes("q_auto"))
        assert.ok(input.pathname.includes("f_auto"))
        if (path !== "avatar") assert.ok(input.pathname.includes(",w_48,h_48,c_fill/"))
        assert.equal(init?.signal, request.signal)
        assert.equal(init?.method, "GET")
        return upstream
      }),
    )
    let response = await avatarRouter.fetch(request)
    assert.equal(response, upstream)
    assert.equal(response.headers.get("Content-Type"), "image/png")
    assert.equal(response.headers.get("Cache-Control"), "public, max-age=60")
    assert.deepEqual(new Uint8Array(await response.arrayBuffer()), new Uint8Array([1, 2, 3]))
  }
})
