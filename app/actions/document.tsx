import type { Handle, MixInput, RemixNode } from "remix/ui"
import { Fragment } from "remix/ui"
import { ImportMap } from "remix/ui/server"

import { getAssetEntry } from "../middleware/assets.ts"
import { getNonce } from "../middleware/security-headers.ts"
import { routes } from "../routes.ts"
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
  let nonce = getNonce()
  let { children, head, title = DEFAULT_TITLE, mix, fontIndex } = handle.props
  return () => {
    let fontConfig = FONT_CONFIGS[fontIndex] ?? FONT_CONFIGS[0]
    let [, fontUrl, fontFamily] = fontConfig

    return (
      <html lang="en" mix={mix}>
        <head>
          {/* Stable keys retain these nodes when route-owned head content changes. */}
          <meta data-rmx-key="charset" charSet="utf-8" />
          <meta
            data-rmx-key="viewport"
            name="viewport"
            content="width=device-width, initial-scale=1"
          />
          <meta data-rmx-key="color-scheme" name="color-scheme" content="light dark" />
          <link data-rmx-key="favicon" rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link
            data-rmx-key="manifest"
            rel="manifest"
            href={routes.manifest.href({ ext: "webmanifest" })}
          />
          <link
            data-rmx-key="apple-touch-icon"
            rel="apple-touch-icon"
            href="/apple-touch-icon.png"
          />
          {Object.entries(assetEntry.stylesheets).map(([name, current]) => (
            <Fragment key={name}>
              <link
                data-rmx-key={`stylesheet-preload:${name}`}
                rel="preload"
                href={current.href}
                as="style"
              />
              <link
                data-rmx-key={`stylesheet:${name}`}
                data-remix-stylesheet={name}
                rel="stylesheet"
                href={current.href}
              />
            </Fragment>
          ))}
          <title data-rmx-key="title">{title}</title>
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
          <link
            data-rmx-key="font-styles-preconnect"
            rel="preconnect"
            href="https://fonts.googleapis.com"
          />
          <link
            data-rmx-key="font-files-preconnect"
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />

          <link data-rmx-key="font-stylesheet" rel="stylesheet" href={fontUrl} />
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
          <script
            data-rmx-key="browser-entry"
            nonce={nonce}
            type="module"
            src={assetEntry.scriptEntry.href}
          />
        </body>
      </html>
    )
  }
}

function readAppDisplayName(value: string): string {
  return value.startsWith("%%") ? "Logan McAnsh" : decodeURIComponent(value)
}
