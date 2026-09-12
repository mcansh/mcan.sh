import type { Handle, MixInput, RemixNode } from "remix/ui"
import { Fragment } from "remix/ui"
import { ImportMap } from "remix/ui/server"

import { getAssetEntry } from "../middleware/assets.ts"
import { FONT_CONFIGS } from "./home-page/shared.tsx"

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
  let { children, head, title = DEFAULT_TITLE, mix, fontIndex } = handle.props
  return () => {
    let fontConfig = FONT_CONFIGS[fontIndex] ?? FONT_CONFIGS[0]
    let [, fontUrl, fontFamily] = fontConfig

    return (
      <html lang="en" mix={mix}>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="color-scheme" content="light dark" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
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
          <ImportMap value={assetEntry.scriptEntry.importMap} />
          {assetEntry.scriptEntry.preloads.map((href) => (
            <link
              key={href}
              data-rmx-key={`modulepreload:${href}`}
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
            innerHTML={`
              :root {
                --font-sans: ${fontFamily};
              }
              body {
                font-family: var(--font-sans);
              }
            `}
          />
        </head>
        <body>
          {children}
          <script type="module" src={assetEntry.scriptEntry.href} />
        </body>
      </html>
    )
  }
}

function readAppDisplayName(value: string): string {
  return value.startsWith("%%") ? "Logan McAnsh" : decodeURIComponent(value)
}
