import { css } from "remix/component"
import { getContext } from "remix/middleware/async-context"

import { Document } from "../actions/document.tsx"
import { routes } from "../routes.ts"
import { getOpenGraphImageUrl } from "../utils/cloudinary.ts"
import { env } from "../utils/env.ts"
import { getSeo } from "../utils/public-origin.ts"

const linkStyles = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "2.75rem",
  paddingInline: "1.25rem",
  borderRadius: "0.5rem",
  fontWeight: 500,
  textDecoration: "none",
  "&:focus-visible": { outline: "2px solid currentColor", outlineOffset: "4px" },
  "&:active": { opacity: 0.7 },
})

export function NotFoundPage() {
  let seo = getSeo(getContext().request)

  return () => (
    <Document
      title="Page not found"
      description="This page couldn't be found. Head back to Logan McAnsh's homepage."
      ogImage={getOpenGraphImageUrl(env.CLOUDINARY_CLOUD_NAME)}
      fontIndex={0}
      robots={seo.robotsTag({ index: false })}
      mix={css({
        "&, body": {
          minHeight: "100dvh",
          color: "#171717",
          backgroundColor: "#fafafa",
          "@media (prefers-color-scheme: dark)": {
            color: "#f5f5f5",
            backgroundColor: "#0a0a0a",
          },
        },
      })}
    >
      <div
        mix={css({
          display: "flex",
          flexDirection: "column",
          minHeight: "100dvh",
          maxWidth: "64rem",
          marginInline: "auto",
          padding: "clamp(1.25rem, 4vw, 3rem)",
        })}
      >
        <header>
          <a
            href={routes.home.href()}
            mix={[
              linkStyles,
              css({
                paddingInline: 0,
                color: "inherit",
                "&:hover": { textDecoration: "underline", textUnderlineOffset: "0.25em" },
              }),
            ]}
          >
            Logan McAnsh
          </a>
        </header>
        <main
          mix={css({
            display: "flex",
            flex: 1,
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingBlock: "3rem 5rem",
          })}
        >
          <p
            aria-label="Error 404"
            mix={css({
              fontSize: "clamp(6rem, 22vw, 12rem)",
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: "-0.075em",
              color: "#737373",
              "@media (prefers-color-scheme: dark)": { color: "#a3a3a3" },
            })}
          >
            404
          </p>
          <h1
            mix={css({
              marginTop: "1.5rem",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              lineHeight: 1.15,
              fontWeight: 500,
              letterSpacing: "-0.035em",
              textWrap: "balance",
            })}
          >
            Page not found.
          </h1>
          <p
            mix={css({
              marginTop: "1rem",
              maxWidth: "35ch",
              fontSize: "1.125rem",
              lineHeight: 1.6,
              color: "#525252",
              "@media (prefers-color-scheme: dark)": { color: "#a3a3a3" },
            })}
          >
            This page may have moved, or the link may be incorrect. Here's a way back.
          </p>
          <nav
            aria-label="Page recovery"
            mix={css({ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "2rem" })}
          >
            <a
              href={routes.home.href()}
              mix={[
                linkStyles,
                css({
                  color: "#fafafa",
                  backgroundColor: "#171717",
                  "&:hover": { backgroundColor: "#404040" },
                  "&:focus-visible": { outlineColor: "#171717" },
                  "@media (prefers-color-scheme: dark)": {
                    color: "#171717",
                    backgroundColor: "#f5f5f5",
                    "&:hover": { backgroundColor: "#d4d4d4" },
                    "&:focus-visible": { outlineColor: "#f5f5f5" },
                  },
                }),
              ]}
            >
              Back to home
            </a>
            <a
              href={routes.resume.href()}
              mix={[
                linkStyles,
                css({
                  color: "inherit",
                  "&:hover": { textDecoration: "underline", textUnderlineOffset: "0.25em" },
                }),
              ]}
            >
              View résumé
            </a>
          </nav>
        </main>
      </div>
    </Document>
  )
}
