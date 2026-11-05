import type { SchemaOrg } from "@sdxc/seo"
import { Seo } from "@sdxc/seo"
import type { Handle, MixInput, RemixNode } from "remix/component"
import { unsafeHTML } from "remix/component"
import { ImportMap } from "remix/component/server"
import { getContext } from "remix/middleware/async-context"

import { scriptEntry, stylesheetHref } from "../assets.ts"
import { getNonce } from "../middleware/security-headers.ts"
import { routes } from "../routes.ts"
import { getCanonicalHref, getSeo } from "../utils/public-origin.ts"
import { bodyFontStylesheetUrl, fontConfigAt } from "./public/fonts.ts"

export interface DocumentProps {
  children?: RemixNode
  head?: RemixNode
  title?: string
  description: string
  ogImage: string
  ogType?: Seo.OpenGraph["type"]
  mix?: MixInput<HTMLElement>
  fontIndex: number
}

export type PersonSchema = {
  "@type": "Person"
  name: string
  url: string
  jobTitle: string
  image: string
  sameAs: string[]
}

export type PersonJsonLd = {
  "@context": "https://schema.org"
} & PersonSchema

export type ProfilePageJsonLd = {
  "@context": "https://schema.org"
  "@type": "ProfilePage"
  name: string
  url: string
  description: string
  mainEntity: PersonSchema
}

type JsonLd = PersonJsonLd | SchemaOrg.WebSite | ProfilePageJsonLd

const DEFAULT_TITLE = readAppDisplayName("Logan McAnsh")

const PERSON_SAME_AS = [
  "https://github.com/mcansh",
  "https://linkedin.com/in/loganmcansh",
  "https://x.com/loganmcansh",
] as const

export function createPersonSchema(url: string, image: string): PersonSchema {
  return {
    "@type": "Person",
    name: "Logan McAnsh",
    url,
    jobTitle: "Senior Software Engineer",
    image,
    sameAs: [...PERSON_SAME_AS],
  }
}

export function createPersonJsonLd(url: string, image: string): PersonJsonLd {
  return {
    "@context": "https://schema.org",
    ...createPersonSchema(url, image),
  }
}

export function createProfilePageJsonLd(
  url: string,
  description: string,
  person: PersonSchema,
): ProfilePageJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: "Resume | Logan McAnsh",
    url,
    description,
    mainEntity: person,
  }
}

export function jsonLd(data: JsonLd, nonce: string) {
  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      innerHTML={unsafeHTML(JSON.stringify(data).replace(/</g, "\\u003c"))}
    />
  )
}

export function Document(handle: Handle<DocumentProps>) {
  let nonce = getNonce()
  let canonicalUrl = getCanonicalHref(getContext().request)
  let seo = getSeo(getContext().request)
  let {
    children,
    head,
    title = DEFAULT_TITLE,
    description,
    ogImage,
    ogType = "website",
    mix,
    fontIndex,
  } = handle.props
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
          <link rel="preload" href={stylesheetHref} as="style" />
          <link rel="stylesheet" href={stylesheetHref} />
          <Seo.Meta
            title={title}
            description={description}
            canonical={canonicalUrl}
            site={seo.site}
            og={{ type: ogType, image: ogImage }}
          />
          {head}
          <ImportMap nonce={nonce} value={scriptEntry.importMap} />
          {scriptEntry.preloads.map((href) => (
            <link key={href} nonce={nonce} rel="modulepreload" href={href} />
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
          <script nonce={nonce} type="module" src={scriptEntry.href} />
        </body>
      </html>
    )
  }
}

function readAppDisplayName(value: string): string {
  return value.startsWith("%%") ? "Logan McAnsh" : decodeURIComponent(value)
}
