import assert from "node:assert/strict"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { test } from "node:test"

import { build, loadConfigFromFile } from "vite"

const configFile = new URL("./vite.config.ts", import.meta.url).pathname

test("production browser builds expose only the public Sentry DSN", async (t) => {
  let directory = await mkdtemp(join(tmpdir(), "mcan-sentry-build-"))
  let previousDirectory = process.cwd()
  let previousDsn = process.env.SENTRY_DSN
  t.after(async () => {
    process.chdir(previousDirectory)
    if (previousDsn === undefined) delete process.env.SENTRY_DSN
    else process.env.SENTRY_DSN = previousDsn
    await rm(directory, { recursive: true, force: true })
  })
  process.chdir(directory)
  let entry = join(directory, "entry.js")
  await writeFile(
    entry,
    "export const dsn = import.meta.env.SENTRY_DSN; export const token = import.meta.env.SENTRY_AUTH_TOKEN; export const privateDsn = import.meta.env.SENTRY_DSN_PRIVATE",
  )
  await writeFile(
    join(directory, ".env.production"),
    "SENTRY_DSN=https://file@ingest.example.com/123\nSENTRY_AUTH_TOKEN=private-token-fixture\nSENTRY_DSN_PRIVATE=private-dsn-fixture\n",
  )

  for (let fixture of [
    {
      name: "mode-specific env file",
      input: undefined,
      expected: "https://file@ingest.example.com/123",
    },
    {
      name: "shell override",
      input: "https://shell@ingest.example.com/456",
      expected: "https://shell@ingest.example.com/456",
    },
    { name: "disabled", input: "", expected: "" },
  ]) {
    await t.test(fixture.name, async () => {
      if (fixture.input === undefined) delete process.env.SENTRY_DSN
      else process.env.SENTRY_DSN = fixture.input
      let loaded = await loadConfigFromFile({ command: "build", mode: "production" }, configFile)
      assert.ok(loaded)
      let result = await build({
        configFile: false,
        define: loaded.config.define,
        envPrefix: loaded.config.envPrefix,
        logLevel: "silent",
        build: {
          write: false,
          minify: false,
          lib: { entry, formats: ["es"], fileName: "entry" },
        },
      })
      let outputs = Array.isArray(result) ? result : [result]
      let output = outputs[0]
      assert.ok(output && "output" in output)
      let chunk = output.output.find((output) => output.type === "chunk")
      assert.ok(chunk)
      let built = await import(`data:text/javascript,${encodeURIComponent(chunk.code)}`)
      assert.equal(built.dsn, fixture.expected)
      assert.equal(built.token, undefined)
      assert.equal(built.privateDsn, undefined)
    })
  }
})
