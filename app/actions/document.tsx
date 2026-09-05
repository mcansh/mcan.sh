import type { Handle, MixInput, RemixNode } from "remix/ui"

import { entryHref, entryPreloads, fonts, globalCssHref, globalCssPreloads } from "../assets.ts"

export interface DocumentProps {
  children?: RemixNode
  head?: RemixNode
  title?: string
  mix?: MixInput<HTMLElement>
}

const DEFAULT_TITLE = readAppDisplayName("Logan McAnsh")

export function Document(handle: Handle<DocumentProps>) {
  return () => {
    let { children, head, title = DEFAULT_TITLE, mix } = handle.props

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
            `}
          />
        </head>
        <body>{children}</body>
      </html>
    )
  }
}

function readAppDisplayName(value: string): string {
  return value.startsWith("%%") ? "Logan McAnsh" : decodeURIComponent(value)
}
