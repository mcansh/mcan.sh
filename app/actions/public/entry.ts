import { captureException, init } from "@sentry/browser"
import { revalidate } from "pitlane/vite-plugin-remix/hmr"
import { run } from "remix/component"

import { installPickerFontLoader } from "./picker-fonts.ts"

const dsn = document.querySelector<HTMLMetaElement>('meta[name="sentry-dsn"]')?.content

init({
  dsn,
  enabled: import.meta.env.PROD && Boolean(dsn),
  environment: import.meta.env.MODE,
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: false,
    httpBodies: [],
    urlQueryParams: false,
  },
})

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
  captureException(event.error)
  console.error(event.error)
})

await app.ready()
