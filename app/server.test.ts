import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { once } from "node:events"
import { test } from "node:test"
import { fileURLToPath } from "node:url"

process.env.CLOUDINARY_CLOUD_NAME = "website-test"
const { parseEnv } = await import("./utils/env.ts")

test("production uses a configured public origin for Node requests", async () => {
  let input = {
    CLOUDINARY_CLOUD_NAME: "website-test",
    SENTRY_REPORT_URL: "https://reports.example.com/csp",
  }
  assert.equal(parseEnv(input, "production").PUBLIC_ORIGIN, "https://mcan.sh")
  assert.equal(parseEnv(input, "development").PUBLIC_ORIGIN, undefined)
  for (let value of [
    "https://example.com/path",
    "https://user:pass@example.com",
    "https://example.com/?x=1",
    "ftp://example.com",
  ]) {
    assert.throws(() => parseEnv({ ...input, PUBLIC_ORIGIN: value }, "production"))
  }
  for (let configuredOrigin of [undefined, "https://preview.example.com:8443"]) {
    let origin = configuredOrigin ?? "https://mcan.sh"
    let child = spawn(process.execPath, ["--import", "remix/node-tsx", "server.ts"], {
      cwd: fileURLToPath(new URL("../", import.meta.url)),
      env: {
        ...process.env,
        ...input,
        PUBLIC_ORIGIN: configuredOrigin,
        NODE_ENV: "production",
        PORT: "0",
        HMR_PROXY_PORT: "",
        REMIX_NODE_HMR: "",
      },
      stdio: ["ignore", "pipe", "inherit"],
    })
    let exited = once(child, "exit")
    let timeout = setTimeout(() => child.kill("SIGKILL"), 15000)
    try {
      let ready = await Promise.race([
        once(child.stdout, "data").then(([chunk]) => String(chunk)),
        exited.then(() => {
          throw new Error("Server exited before listening")
        }),
      ])
      let port = ready.match(/Server listening on http:\/\/localhost:(\d+)/)?.[1]
      assert.ok(port, ready)
      let response = await fetch(`http://127.0.0.1:${port}/sitemap.xml`, {
        headers: {
          Host: "internal.example",
          "X-Forwarded-Host": "untrusted.example",
          "X-Forwarded-Proto": "http",
        },
      })
      assert.equal(response.status, 200)
      let xml = await response.text()
      assert.ok(xml.includes(`<loc>${origin}/</loc>`))
      assert.ok(xml.includes(`<loc>${origin}/resume</loc>`))
      assert.ok(!xml.includes("internal.example") && !xml.includes("untrusted.example"))
    } finally {
      clearTimeout(timeout)
      child.kill("SIGTERM")
      await exited
    }
  }
})
