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
  async resolveFrame(src, options) {
    let response = await fetch(src, {
      headers: { Accept: "text/html" },
      method: options?.method,
      body: getRequestBody(options?.formData, options?.method, options?.encType),
      signal: options?.signal,
    })
    if (!response.ok) {
      return `<pre>Frame error: ${response.status} ${response.statusText}</pre>`
    }

    if (response.body) return response.body
    return await response.text()
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

function getRequestBody(
  formData?: FormData,
  method?: string,
  encType?: string,
): BodyInit | undefined {
  if (!formData || method?.toLowerCase() === "get") return
  if (encType !== "application/x-www-form-urlencoded") return formData

  let body = new URLSearchParams()
  for (let [name, value] of formData) {
    body.append(name, value instanceof File ? value.name : value)
  }
  return body
}

await app.ready()
