import assert from "node:assert/strict"
import { createRequire } from "node:module"
import { test } from "node:test"
import { pathToFileURL } from "node:url"
import { runInNewContext } from "node:vm"

// Exercise the actual installed dependency so dropping the patch fails this test.
const requireFromRemix = createRequire(import.meta.resolve("remix/assets"))
const assetsEntry = pathToFileURL(requireFromRemix.resolve("@remix-run/assets"))
const { createHmrClientSource } = await import(new URL("./lib/hmr.js", assetsEntry).href)

test("HMR installs import maps with the document nonce before inserting them", () => {
  for (let nonce of ["document-nonce", ""]) {
    let source = createHmrClientSource({
      dataKey: "test",
      eventPathname: "/hmr",
      moduleImporter: null,
    })
    let inserted = false
    let document = {
      baseURI: "https://mcan.sh/",
      querySelectorAll: () => [],
      querySelector: () => (nonce ? { nonce } : null),
      createElement: () => ({ nonce: "", type: "", textContent: "", setAttribute() {} }),
      head: {
        appendChild(script: HTMLScriptElement) {
          // A nonce-bearing policy rejects an inline map at insertion time.
          assert.equal(script.nonce, nonce)
          assert.equal(script.type, "importmap")
          assert.deepEqual(JSON.parse(script.textContent!), { imports: { added: "/added.js" } })
          inserted = true
        },
      },
    }
    runInNewContext(
      source
        .replace("export function createHotContext", "function createHotContext")
        .replaceAll("import.meta.url", JSON.stringify("https://mcan.sh/hmr.js")) +
        '\ninstallImportMap({ imports: { added: "/added.js" } });',
      {
        document,
        URL,
        MutationObserver: class {
          observe() {}
          takeRecords() {
            return []
          }
        },
        EventSource: class {},
      },
    )
    assert.equal(inserted, true)
  }
})
