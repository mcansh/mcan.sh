import type { Handle, MixInput } from "remix/ui"
import { css, Frame } from "remix/ui"

import { routes } from "../../routes.ts"
import { Document } from "../document.tsx"

export type HomePageProps = {
  me: {
    url: string
    size: string
    srcSet: string
    width: number
    height: number
  }
  designIndex?: number
  fontIndex?: number
}

export function previewHref(design: number): string {
  return routes.preview.href(undefined, { searchParams: { design } })
}

export function HomeShell(handle: Handle<HomePageProps & { bodyMix: MixInput<HTMLElement> }>) {
  return () => {
    let { designIndex = 0, fontIndex = 0, bodyMix } = handle.props
    return (
      <Document head={<HomeHead />} fontIndex={fontIndex} mix={[bodyMix]}>
        <Frame name="preview" src={previewHref(designIndex + 1)} />
      </Document>
    )
  }
}

export function HomeHead() {
  return () => (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </>
  )
}

export function DesignSwitcher(handle: Handle<{ designIndex: number; fontIndex: number }>) {
  return () => {
    let { designIndex, fontIndex } = handle.props
    let nextDesign = ((designIndex + 1) % DESIGN_CONFIGS.length) + 1
    let prevDesign = ((designIndex - 1 + DESIGN_CONFIGS.length) % DESIGN_CONFIGS.length) + 1
    let nextFont = ((fontIndex + 1) % FONT_CONFIGS.length) + 1
    return (
      <details
        mix={css({
          position: "fixed",
          bottom: "1rem",
          right: "1rem",
          zIndex: 100,
          display: "flex",
          flexDirection: "column-reverse",
          alignItems: "flex-end",
          gap: "0.5rem",
          fontSize: "var(--text-sm)",
          lineHeight: "var(--text-sm--line-height)",
          "& summary": {
            listStyle: "none",
            cursor: "pointer",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "9999px",
            border: "1px solid rgb(0 0 0 / 0.1)",
            backgroundColor: "rgb(255 255 255 / 0.9)",
            backdropFilter: "blur(8px)",
            color: "inherit",
          },
          "& summary::-webkit-details-marker": { display: "none" },
          "& summary::marker": { content: "none" },
          "& summary:focus-visible": {
            outline: "2px solid currentColor",
            outlineOffset: "2px",
          },
          "@media (prefers-color-scheme: dark)": {
            "& summary": {
              borderColor: "rgb(255 255 255 / 0.15)",
              backgroundColor: "rgb(0 0 0 / 0.85)",
            },
          },
        })}
      >
        <summary aria-label="Show design and font options" title="Design and font options">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
          <span
            aria-hidden="true"
            mix={css({
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "max(100%, 3rem)",
              height: "max(100%, 3rem)",
              transform: "translate(-50%, -50%)",
              "@media (pointer: fine)": { display: "none" },
            })}
          />
        </summary>
        <nav
          aria-label="Design and font preview switcher"
          mix={css({
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            padding: "0.75rem",
            borderRadius: "0.75rem",
            border: "1px solid rgb(0 0 0 / 0.1)",
            backgroundColor: "rgb(255 255 255 / 0.9)",
            backdropFilter: "blur(8px)",
            "@media (prefers-color-scheme: dark)": {
              borderColor: "rgb(255 255 255 / 0.15)",
              backgroundColor: "rgb(0 0 0 / 0.85)",
            },
          })}
        >
          <div
            mix={css({
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            })}
          >
            <a
              data-rmx-document
              data-rmx-target="preview"
              data-rmx-src={previewHref(prevDesign)}
              href={routes.home.href(undefined, {
                searchParams: { design: prevDesign, font: fontIndex + 1 },
              })}
              aria-label="Previous design"
              mix={css({
                padding: "0.25rem 0.5rem",
                borderRadius: "0.375rem",
                border: "1px solid rgb(0 0 0 / 0.1)",
                textDecoration: "none",
                color: "inherit",
                "@media (prefers-color-scheme: dark)": {
                  borderColor: "rgb(255 255 255 / 0.2)",
                },
              })}
            >
              ←
            </a>
            <span
              mix={css({
                fontWeight: 500,
                minWidth: "9rem",
                textAlign: "center",
              })}
            >
              {DESIGN_CONFIGS[designIndex]?.[0]} ({designIndex + 1}/{DESIGN_CONFIGS.length})
            </span>
            <a
              data-rmx-document
              data-rmx-target="preview"
              data-rmx-src={previewHref(nextDesign)}
              href={routes.home.href(undefined, {
                searchParams: { design: nextDesign, font: fontIndex + 1 },
              })}
              aria-label="Next design"
              mix={css({
                padding: "0.25rem 0.5rem",
                borderRadius: "0.375rem",
                border: "1px solid rgb(0 0 0 / 0.1)",
                textDecoration: "none",
                color: "inherit",
                "@media (prefers-color-scheme: dark)": {
                  borderColor: "rgb(255 255 255 / 0.2)",
                },
              })}
            >
              →
            </a>
          </div>
          <div
            mix={css({
              display: "flex",
              flexWrap: "wrap",
              gap: "0.375rem",
              maxWidth: "16rem",
            })}
          >
            {DESIGN_CONFIGS.map(([name], index) => (
              <a
                key={name}
                data-rmx-document
                data-rmx-target="preview"
                data-rmx-src={previewHref(index + 1)}
                href={routes.home.href(undefined, {
                  searchParams: { design: index + 1, font: fontIndex + 1 },
                })}
                aria-current={index === designIndex ? "true" : undefined}
                mix={css({
                  padding: "0.125rem 0.5rem",
                  borderRadius: "9999px",
                  border: "1px solid",
                  borderColor: index === designIndex ? "currentColor" : "rgb(0 0 0 / 0.1)",
                  fontWeight: index === designIndex ? 700 : 400,
                  textDecoration: "none",
                  color: "inherit",
                  "@media (prefers-color-scheme: dark)": {
                    borderColor: index === designIndex ? "currentColor" : "rgb(255 255 255 / 0.2)",
                  },
                })}
              >
                {index + 1}
              </a>
            ))}
          </div>
          <div
            mix={css({
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.5rem",
              borderTop: "1px solid rgb(0 0 0 / 0.08)",
              paddingTop: "0.5rem",
              "@media (prefers-color-scheme: dark)": {
                borderTopColor: "rgb(255 255 255 / 0.12)",
              },
            })}
          >
            <span mix={css({ fontWeight: 500 })}>{FONT_CONFIGS[fontIndex]?.[0]}</span>
            <a
              data-rmx-document
              href={routes.home.href(undefined, {
                searchParams: { design: designIndex + 1, font: nextFont },
              })}
              mix={css({ color: "inherit" })}
            >
              Next font →
            </a>
          </div>
          <div
            mix={css({
              display: "flex",
              flexWrap: "wrap",
              gap: "0.375rem",
              maxWidth: "16rem",
            })}
          >
            {FONT_CONFIGS.map(([name], i) => (
              <a
                key={name}
                data-rmx-document
                href={fontHref(designIndex + 1, i + 1)}
                aria-current={i === fontIndex ? "true" : undefined}
                mix={css({
                  padding: "0.125rem 0.5rem",
                  borderRadius: "9999px",
                  border: "1px solid",
                  borderColor: i === fontIndex ? "currentColor" : "rgb(0 0 0 / 0.1)",
                  fontWeight: i === fontIndex ? 700 : 400,
                  textDecoration: "none",
                  color: "inherit",
                  "@media (prefers-color-scheme: dark)": {
                    borderColor: i === fontIndex ? "currentColor" : "rgb(255 255 255 / 0.2)",
                  },
                })}
              >
                {name}
              </a>
            ))}
          </div>
        </nav>
      </details>
    )
  }
}

// Font configurations matching Document
const FONT_CONFIGS = [
  [
    "Inter (Default)",
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap",
    "Inter",
  ],
  [
    "Geist",
    "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;700&display=swap",
    "Geist",
  ],
  [
    "Instrument Sans",
    "https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;700&display=swap",
    "Instrument Sans",
  ],
  [
    "DM Sans",
    "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap",
    "DM Sans",
  ],
  [
    "Space Grotesk",
    "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap",
    "Space Grotesk",
  ],
] as const

const DESIGN_CONFIGS = [
  ["Minimal", "Clean centered layout"],
  ["Profile", "Left-aligned with bio & skills"],
  ["Showcase", "Experience timeline + projects"],
  ["Split", "Desktop split / mobile stacked"],
] as const

function fontHref(design: number, font: number): string {
  return routes.home.href(undefined, {
    searchParams: { design, font },
  })
}
