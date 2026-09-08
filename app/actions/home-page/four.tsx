import { css } from "remix/ui"
import type { Handle } from "remix/ui"

import { routes } from "../../routes.ts"
import { spaceY } from "../public/css-mixins.ts"
import { DesignSwitcher } from "./shared.tsx"
import type { HomePageProps } from "./shared.tsx"

// ============================================================================
// DESIGN OPTION 4: Split Layout (Desktop) / Stacked (Mobile)
// ============================================================================
// Visual split with avatar on left, content on right (desktop)
// Collapses to stacked centered layout on mobile
// Following responsive-design.md: mobile-first, proper breakpoint usage
export const homePageOption4Body = css({
  "&, body": {
    minHeight: "100dvh",
    "@media (prefers-color-scheme: dark)": {
      color: "white",
      backgroundColor: "#0a0a0a",
    },
  },
})

export function HomePageOption4Content(handle: Handle<HomePageProps>) {
  let designIndex = handle.props.designIndex ?? 0
  let fontIndex = handle.props.fontIndex ?? 0
  return () => (
    <main
      mix={css({
        display: "flex",
        minHeight: "100dvh",
        alignItems: "center",
        justifyContent: "center",
        paddingInline: "1rem",
        paddingBlock: "4rem",
        "@media (width >= 64rem)": { paddingBlock: 0 },
      })}
    >
      <div
        mix={css({
          width: "100%",
          maxWidth: "var(--container-5xl)",
        })}
      >
        {/* Split layout on desktop, stacked on mobile */}
        <div
          mix={css({
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "2rem",
            "@media (width >= 64rem)": {
              gridTemplateColumns: "5fr 7fr",
              gap: "4rem",
              alignItems: "center",
            },
          })}
        >
          {/* Left: Avatar & Visual */}
          <div
            mix={css({
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              "@media (width >= 64rem)": {
                alignItems: "flex-start",
                textAlign: "left",
              },
            })}
          >
            <div mix={css({ position: "relative" })}>
              <img
                mix={css({
                  width: "12rem",
                  height: "12rem",
                  borderRadius: "calc(infinity * 1px)",
                  outline: "1px solid",
                  outlineColor: "rgb(0 0 0 / 0.05)",
                  "@media (prefers-color-scheme: dark)": {
                    outlineColor: "rgb(255 255 255 / 0.1)",
                  },
                  "@media (width >= 64rem)": {
                    width: "16rem",
                    height: "16rem",
                  },
                })}
                width={handle.props.me.size}
                height={handle.props.me.size}
                alt="Logan McAnsh"
                fetchPriority="high"
                src={handle.props.me.url}
                srcSet={handle.props.me.srcSet}
              />
              {/* Decorative ring */}
              <div
                mix={css({
                  position: "absolute",
                  inset: "-1rem",
                  borderRadius: "calc(infinity * 1px)",
                  border: "1px solid",
                  borderColor: "rgb(0 0 0 / 0.05)",
                  opacity: 0.5,
                  "@media (prefers-color-scheme: dark)": {
                    borderColor: "rgb(255 255 255 / 0.1)",
                  },
                  pointerEvents: "none",
                })}
              />
            </div>

            <div
              mix={css({
                marginTop: "1.5rem",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "0.5rem",
                "@media (width >= 64rem)": {
                  justifyContent: "flex-start",
                },
              })}
            >
              <a
                href="https://github.com/mcansh"
                mix={css({
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  color: "rgb(0 0 0 / 0.7)",
                  textDecoration: "none",
                  backgroundColor: "rgb(0 0 0 / 0.05)",
                  borderRadius: "0.375rem",
                  border: "1px solid",
                  borderColor: "rgb(0 0 0 / 0.1)",
                  transition: "all 0.15s ease",
                  "@media (prefers-color-scheme: dark)": {
                    color: "rgb(255 255 255 / 0.9)",
                    backgroundColor: "rgb(255 255 255 / 0.1)",
                    borderColor: "rgb(255 255 255 / 0.1)",
                  },
                  "&:hover": {
                    backgroundColor: "rgb(0 0 0 / 0.1)",
                    "@media (prefers-color-scheme: dark)": {
                      backgroundColor: "rgb(255 255 255 / 0.15)",
                    },
                  },
                })}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
              <a
                href={routes.resume.href()}
                mix={css({
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  color: "rgb(0 0 0 / 0.7)",
                  textDecoration: "none",
                  backgroundColor: "rgb(0 0 0 / 0.05)",
                  borderRadius: "0.375rem",
                  border: "1px solid",
                  borderColor: "rgb(0 0 0 / 0.1)",
                  transition: "all 0.15s ease",
                  "@media (prefers-color-scheme: dark)": {
                    color: "rgb(255 255 255 / 0.9)",
                    backgroundColor: "rgb(255 255 255 / 0.1)",
                    borderColor: "rgb(255 255 255 / 0.1)",
                  },
                  "&:hover": {
                    backgroundColor: "rgb(0 0 0 / 0.1)",
                    "@media (prefers-color-scheme: dark)": {
                      backgroundColor: "rgb(255 255 255 / 0.15)",
                    },
                  },
                })}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Resume
              </a>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <div
              mix={css({
                maxWidth: "32rem",
                "@media (width >= 64rem)": {
                  marginLeft: "auto",
                },
              })}
            >
              <p
                mix={css({
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "rgb(0 0 0 / 0.4)",
                  marginBottom: "0.75rem",
                  "@media (prefers-color-scheme: dark)": {
                    color: "rgb(255 255 255 / 0.5)",
                  },
                })}
              >
                Senior Software Engineer
              </p>
              <h1
                mix={css({
                  fontSize: "var(--text-4xl)",
                  lineHeight: "var(--text-4xl--line-height)",
                  fontWeight: 500,
                  textWrap: "balance",
                  maxWidth: "35ch",
                  marginBottom: "1rem",
                  "@media (width >= 64rem)": {
                    fontSize: "var(--text-5xl)",
                    lineHeight: "var(--text-5xl--line-height)",
                  },
                })}
              >
                Logan McAnsh
              </h1>
              <p
                mix={css({
                  fontSize: "var(--text-xl)",
                  lineHeight: "var(--text-xl--line-height)",
                  fontWeight: 400,
                  textWrap: "pretty",
                  maxWidth: "48ch",
                  color: "rgb(0 0 0 / 0.6)",
                  marginBottom: "1.5rem",
                  "@media (prefers-color-scheme: dark)": {
                    color: "rgb(255 255 255 / 0.7)",
                  },
                })}
              >
                I build scalable web applications and developer tools. Currently leading frontend
                architecture at United Wholesale Mortgage. Previously on the Remix team at Shopify.
              </p>

              <div mix={spaceY("0.75rem")}>
                <div
                  mix={css({
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  })}
                >
                  <div
                    mix={css({
                      width: "0.5rem",
                      height: "0.5rem",
                      borderRadius: "9999px",
                      backgroundColor: "rgb(0 0 0 / 0.3)",
                      "@media (prefers-color-scheme: dark)": {
                        backgroundColor: "rgb(255 255 255 / 0.4)",
                      },
                    })}
                    aria-hidden="true"
                  />
                  <span
                    mix={css({
                      fontSize: "var(--text-base)",
                      lineHeight: "var(--text-base--line-height)",
                      color: "rgb(0 0 0 / 0.7)",
                      "@media (prefers-color-scheme: dark)": {
                        color: "rgb(255 255 255 / 0.8)",
                      },
                    })}
                  >
                    TypeScript, React, Remix, Node.js
                  </span>
                </div>
                <div
                  mix={css({
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  })}
                >
                  <div
                    mix={css({
                      width: "0.5rem",
                      height: "0.5rem",
                      borderRadius: "9999px",
                      backgroundColor: "rgb(0 0 0 / 0.3)",
                      "@media (prefers-color-scheme: dark)": {
                        backgroundColor: "rgb(255 255 255 / 0.4)",
                      },
                    })}
                    aria-hidden="true"
                  />
                  <span
                    mix={css({
                      fontSize: "var(--text-base)",
                      lineHeight: "var(--text-base--line-height)",
                      color: "rgb(0 0 0 / 0.7)",
                      "@media (prefers-color-scheme: dark)": {
                        color: "rgb(255 255 255 / 0.8)",
                      },
                    })}
                  >
                    Cloudflare Workers, PostgreSQL, Tailwind
                  </span>
                </div>
                <div
                  mix={css({
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  })}
                >
                  <div
                    mix={css({
                      width: "0.5rem",
                      height: "0.5rem",
                      borderRadius: "9999px",
                      backgroundColor: "rgb(0 0 0 / 0.3)",
                      "@media (prefers-color-scheme: dark)": {
                        backgroundColor: "rgb(255 255 255 / 0.4)",
                      },
                    })}
                    aria-hidden="true"
                  />
                  <span
                    mix={css({
                      fontSize: "var(--text-base)",
                      lineHeight: "var(--text-base--line-height)",
                      color: "rgb(0 0 0 / 0.7)",
                      "@media (prefers-color-scheme: dark)": {
                        color: "rgb(255 255 255 / 0.8)",
                      },
                    })}
                  >
                    Open source contributor & maintainer
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DesignSwitcher designIndex={designIndex} fontIndex={fontIndex} />
    </main>
  )
}
