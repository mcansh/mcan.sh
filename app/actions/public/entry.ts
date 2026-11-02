import { revalidate } from "pitlane/vite-plugin-remix/hmr"
import { run } from "remix/component"

import { installPickerFontLoader } from "./picker-fonts.ts"

installPickerFontLoader()

const app = run({
  async loadModule(moduleUrl, exportName) {
    let mod = await import(/* @vite-ignore */ moduleUrl)
    let exported = mod[exportName]

    if (!(exported instanceof Function)) {
      throw new Error(`Expected module ${moduleUrl} to export a function named ${exportName}`)
    }

    return exported
  },
})

if (import.meta.hot) {
  import.meta.hot.on("server:update", () => revalidate(app))
}

app.addEventListener("error", (event) => {
  console.error(event.error)
})

await app.ready()
