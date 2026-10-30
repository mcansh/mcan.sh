import type { Handle, MixInput, RemixNode } from "remix/component"
import { Fragment, unsafeHTML } from "remix/component"
import { ImportMap } from "remix/component/server"

import { getAssetEntry } from "../middleware/assets.ts"
import { getNonce } from "../middleware/security-headers.ts"
import { routes } from "../routes.ts"
import { bodyFontStylesheetUrl, fontConfigAt } from "./public/fonts.ts"

export interface DocumentProps {
  children?: RemixNode
  head?: RemixNode
  title?: string
  mix?: MixInput<HTMLElement>
  fontIndex: number
}

const DEFAULT_TITLE = readAppDisplayName("Logan McAnsh")

export function Document(handle: Handle<DocumentProps>) {
  let assetEntry = getAssetEntry()
  let nonce = getNonce()
  let { children, head, title = DEFAULT_TITLE, mix, fontIndex } = handle.props
  return () => {
    let [, fontFamily] = fontConfigAt(fontIndex)
    let fontUrl = bodyFontStylesheetUrl(fontFamily)

    return (
      <html lang="en" mix={mix}>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="color-scheme" content="light dark" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="manifest" href={routes.manifest.href({ ext: "webmanifest" })} />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          {Object.entries(assetEntry.stylesheets).map(([name, current]) => (
            <Fragment key={name}>
              <link rel="preload" href={current.href} as="style" />
              <link
                data-rmx-key={`stylesheet:${name}`}
                data-remix-stylesheet={name}
                data-rmx-preserve-dom
                rel="stylesheet"
                href={current.href}
              />
            </Fragment>
          ))}
          <title>{title}</title>
          {head}
          <ImportMap nonce={nonce} value={assetEntry.scriptEntry.importMap} />
          {assetEntry.scriptEntry.preloads.map((href) => (
            <link
              key={href}
              data-rmx-key={`modulepreload:${href}`}
              nonce={nonce}
              rel="modulepreload"
              href={href}
            />
          ))}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

          <link rel="stylesheet" href={fontUrl} />
          <style
            key="fonts"
            data-rmx-key="fonts"
            innerHTML={unsafeHTML(`
              :root {
                --font-sans: ${fontFamily};
              }
              body {
                font-family: var(--font-sans);
              }
            `)}
          />
        </head>
        <body>
          {children}
          <script nonce={nonce} type="module" src={assetEntry.scriptEntry.href} />
        </body>
      </html>
    )
  }
}

function readAppDisplayName(value: string): string {
  return value.startsWith("%%") ? "Logan McAnsh" : decodeURIComponent(value)
}
