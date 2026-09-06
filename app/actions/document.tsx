import type { Handle, MixInput, RemixNode } from "remix/ui"

import { entryHref, entryPreloads, fonts, globalCssHref, globalCssPreloads } from "../assets.ts"

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
    let { children, head, title = DEFAULT_TITLE, mix, fontIndex = 0 } = handle.props
    let fontConfig = FONT_CONFIGS[fontIndex] ?? FONT_CONFIGS[0]
    let [, fontUrl, , fontFamily] = fontConfig

    return (
      <html lang="en" mix={mix}>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="color-scheme" content="light dark" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="stylesheet" href={globalCssHref} />
          {globalCssPreloads.map((href) => (
            <link key={href} rel="preload" href={href} as="style" />
          ))}
          <title>{title}</title>
          {head}
          {entryPreloads.map((href) => (
            <link key={href} rel="modulepreload" href={href} />
          ))}
          <script type="module" src={entryHref} />

          <style
            key="fonts"
            data-rmx-key="fonts"
            data-rmx-preserve-dom
            innerHTML={`
              @font-face {
                font-family: "Berkeley Mono";
                font-weight: 100 900;
                font-display: swap;
                font-style: normal;
                src:
                  url("${fonts.berkeleyMono.href}") format("woff2-variations"),
                  url("${fonts.berkeleyMono.href}") format("woff2");
                src: url("${fonts.berkeleyMono.href}") format("woff2") tech("variations");
              }
              :root {
                --font-sans: ${fontFamily};
              }
              body {
                font-family: var(--font-sans);
              }
            `}
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="stylesheet" href={fontUrl} />
        </head>
        <body>{children}</body>
      </html>
    )
  }
}

function readAppDisplayName(value: string): string {
  return value.startsWith("%%") ? "Logan McAnsh" : decodeURIComponent(value)
}
