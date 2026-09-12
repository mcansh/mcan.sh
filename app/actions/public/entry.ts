import {
  detectMultipleImportMapSupport,
  importModule,
  preloadShim,
} from "remix/multiple-import-maps-polyfill"
import { run } from "remix/ui"

const app = run({
  async loadModule(src, exportName) {
    let mod = await importModule(src)
    let exp = mod[exportName]

    if (!(exp instanceof Function)) {
      throw new Error(`Expected module ${src} to export a function named ${exportName}`)
    }

    return exp
  },
  async processClientEntryPreloads(preloads) {
    if (await detectMultipleImportMapSupport()) return preloads

    preloadShim(preloads)
    return []
  },
})

if (import.meta.hot) {
  import.meta.hot.on("server:update", async () => {
    try {
      await app.ready()
      await app.frames.top.reload()
    } catch (error) {
      console.error("Error reloading top frame on server update", error)
    }
  })
}

app.addEventListener("error", (event) => {
  console.error(event.error)
})

await app.ready()
