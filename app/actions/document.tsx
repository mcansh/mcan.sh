import { Fragment } from "remix/ui"
import type { Handle, MixInput, RemixNode } from "remix/ui"
import { ImportMap } from "remix/ui/server"

import { getAssetEntry } from "../middleware/assets.ts"
import {} from "../middleware/assets.ts"

export interface DocumentProps {
  children?: RemixNode
  head?: RemixNode
  title?: string
  mix?: MixInput<HTMLElement>
  fontIndex?: number
}

const DEFAULT_TITLE = readAppDisplayName("Logan McAnsh")

// Font configurations: [display name, Google Fonts URL, CSS font-family, CSS font stack]
const FONT_CONFIGS = [
  [
    "Inter (Default)",
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap",
    "Inter",
    '"Inter", system-ui',
  ],
  [
    "Geist",
    "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;700&display=swap",
    "Geist",
    '"Geist", system-ui',
  ],
  [
    "Instrument Sans",
    "https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;700&display=swap",
    "Instrument Sans",
    '"Instrument Sans", system-ui',
  ],
  [
    "DM Sans",
    "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap",
    "DM Sans",
    '"DM Sans", system-ui',
  ],
  [
    "Space Grotesk",
    "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap",
    "Space Grotesk",
    '"Space Grotesk", system-ui',
  ],
] as const

export function Document(handle: Handle<DocumentProps>) {
  return () => {
    let assetEntry = getAssetEntry()
    let { children, head, title = DEFAULT_TITLE, mix } = handle.props

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
