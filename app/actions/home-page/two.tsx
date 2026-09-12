import type { Handle } from "remix/ui"
import { css } from "remix/ui"

import { routes } from "../../routes.ts"
import { spaceY } from "../public/css-mixins.ts"
import type { HomePageProps } from "./shared.tsx"
import { DesignSwitcher } from "./shared.tsx"

// ============================================================================
// DESIGN OPTION 2: Profile-Focused with Bio & Skills
// ============================================================================
// Left-aligned layout with avatar, detailed bio, tech stack, and social links
// Following section-layout.md: left-aligned sections, proper container pattern
export const homePageOptions = css({
  "&, body": {
    minHeight: "100dvh",
    "@media (prefers-color-scheme: dark)": {
      color: "white",
      backgroundColor: "black",
    },
  },
})

export function HomePage(handle: Handle<HomePageProps>) {
  let designIndex = handle.props.designIndex ?? 0
  let fontIndex = handle.props.fontIndex ?? 0
  return () => (
    <main
      mix={css({
        paddingInline: "1rem",
        minHeight: "inherit",
      })}
    >
      {/* Section wrapper - vertical padding */}
      <div
        mix={css({
          maxWidth: "56rem",
          marginInline: "auto",
          minHeight: "inherit",
          display: "flex",
          height: "stretch",
          flexDirection: "column",
          justifyContent: "center",
        })}
      >
        {/* Inner container - max-width, centering, horizontal padding */}
        <div
          mix={css({
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "2.5rem",
            "@media (width >= 64rem)": {
              flexDirection: "row",
              gap: "4rem",
            },
          })}
        >
          {/* Avatar column - fixed width on desktop */}
          <div
            mix={css({
              width: "100%",
              flexShrink: 0,
              "@media (width >= 64rem)": { width: "14rem" },
            })}
          >
            <img
              mix={css({
                width: "14rem",
                height: "14rem",
                objectFit: "cover",
                objectPosition: "center -145px",
                borderRadius: "calc(infinity * 1px)",
                outline: "1px solid",
                outlineColor: "rgb(0 0 0 / 0.05)",
                "@media (prefers-color-scheme: dark)": {
                  outlineColor: "rgb(255 255 255 / 0.1)",
                },
                "@media (width >= 64rem)": {
                  height: "39rem",
                  width: "20rem",
                  objectFit: "contain",
                  objectPosition: "unset",
                },
              })}
              width={handle.props.me.width}
              height={handle.props.me.height}
              alt="Logan McAnsh"
              crossOrigin="anonymous"
              fetchPriority="high"
              src={handle.props.me.url}
              srcSet={handle.props.me.srcSet}
            />
          </div>

          {/* Content column - flexible */}
          <div
            mix={css({
              minWidth: 0,
              flex: 1,
              display: "flex",
              height: "stretch",
              flexDirection: "column",
              justifyContent: "center",
            })}
          >
            <div mix={spaceY("0.375rem")}>
              <h1
                mix={css({
                  fontSize: "var(--text-4xl)",
                  lineHeight: "var(--text-4xl--line-height)",
                  fontWeight: 500,
                  textWrap: "balance",
                  maxWidth: "35ch",
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
                  "@media (prefers-color-scheme: dark)": {
                    color: "rgb(255 255 255 / 0.7)",
                  },
                })}
              >
                Senior Software Engineer
              </p>
            </div>

            <p
              mix={css({
                marginBlockStart: "1.5rem",
                fontSize: "var(--text-base)",
                lineHeight: "var(--text-base--line-height)",
                textWrap: "pretty",
                maxWidth: "65ch",
                color: "rgb(0 0 0 / 0.7)",
                "@media (prefers-color-scheme: dark)": {
                  color: "rgb(255 255 255 / 0.8)",
                },
              })}
            >
              I build scalable web applications and developer tools. Currently building developer
              tools and improving architecture at United Wholesale Mortgage. Previously on the Remix
              team at Shopify, where I worked on the framework, developer experience, and open
              source ecosystem.
            </p>

            {/* Tech Stack */}
            <div
              mix={css({
                marginBlockStart: "2rem",
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
              })}
            >
              <span
                mix={css({
                  fontSize: "var(--text-xs)",
                  lineHeight: "var(--text-xs--line-height)",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "rgb(0 0 0 / 0.4)",
                  "@media (prefers-color-scheme: dark)": {
                    color: "rgb(255 255 255 / 0.5)",
                  },
                })}
              >
                Tech Stack
              </span>
              {[
                "TypeScript",
                "React",
                "Remix",
                "Node.js",
                "Cloudflare Workers",
                "PostgreSQL",
                "Tailwind CSS",
              ].map((tech) => (
                <span
                  key={tech}
                  mix={css({
                    fontSize: "var(--text-sm)",
                    lineHeight: "var(--text-sm--line-height)",
                    fontWeight: 500,
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    backgroundColor: "rgb(0 0 0 / 0.05)",
                    color: "rgb(0 0 0 / 0.7)",
                    "@media (prefers-color-scheme: dark)": {
                      backgroundColor: "rgb(255 255 255 / 0.1)",
                      color: "rgb(255 255 255 / 0.9)",
                    },
                  })}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Social Links */}
            <div
              mix={css({
                marginBlockStart: "2rem",
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
              })}
            >
              <a
                href="https://github.com/mcansh"
                mix={css({
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "var(--text-sm)",
                  lineHeight: "var(--text-sm--line-height)",
                  fontWeight: 500,
                  color: "inherit",
                  textDecoration: "none",
                  borderBottom: "1px solid currentColor",
                  paddingBottom: "2px",
                  transition: "opacity 0.15s ease",
                  "&:hover": { opacity: 0.7 },
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
                  fontSize: "var(--text-sm)",
                  lineHeight: "var(--text-sm--line-height)",
                  fontWeight: 500,
                  color: "inherit",
                  textDecoration: "none",
                  borderBottom: "1px solid currentColor",
                  paddingBottom: "2px",
                  transition: "opacity 0.15s ease",
                  "&:hover": { opacity: 0.7 },
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
              <a
                href="https://linkedin.com/in/loganmcansh"
                mix={css({
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "var(--text-sm)",
                  lineHeight: "var(--text-sm--line-height)",
                  fontWeight: 500,
                  color: "inherit",
                  textDecoration: "none",
                  borderBottom: "1px solid currentColor",
                  paddingBottom: "2px",
                  transition: "opacity 0.15s ease",
                  "&:hover": { opacity: 0.7 },
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
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
      <DesignSwitcher designIndex={designIndex} fontIndex={fontIndex} />
    </main>
  )
}
