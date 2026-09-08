import { css } from "remix/ui"
import type { Handle } from "remix/ui"

import { routes } from "../../routes.ts"
import { spaceY } from "../public/css-mixins.ts"
import { DesignSwitcher } from "./shared.tsx"
import type { HomePageProps } from "./shared.tsx"

// ============================================================================
// DESIGN OPTION 3: Work/Project Showcase
// ============================================================================
// Features work experience timeline and featured projects
// Following landing-pages.md: consistent button styles, container styles
export const homePageOption3Body = css({
  "&, body": {
    minHeight: "100dvh",
    "@media (prefers-color-scheme: dark)": {
      color: "white",
      backgroundColor: "black",
    },
  },
})

export function HomePageOption3Content(handle: Handle<HomePageProps>) {
  let experience = [
    {
      role: "Senior Frontend Engineer",
      company: "United Wholesale Mortgage",
      period: "2024 — Present",
      description:
        "Leading frontend architecture for the mortgage platform. Building design systems, improving developer experience, and modernizing the tech stack with Remix, TypeScript, and Cloudflare Workers.",
    },
    {
      role: "Senior Software Engineer – Remix",
      company: "Shopify",
      period: "2022 — 2023",
      description:
        "Key member of the Remix Core Team, where I shipped the flat-routes convention and the @remix-run/testing package. Triaged React Router and Remix issues and PRs, automated release notes with a custom GitHub Action, and helped developers in Discord.",
    },
    {
      role: "Senior Software Engineer",
      company: "Remix",
      period: "2021 — 2023",
      description:
        "Helped build the Remix framework core, from the nightly release pipeline to a faster, more reliable Playwright test suite. Built SQLite-backed docs infrastructure and adapters that convert deployment targets' proprietary requests into standard Request/Response objects.",
    },
    {
      role: "Frontend Web Developer",
      company: "Powerley",
      period: "2016 — 2021",
      description:
        "Led development of white-label web apps with Next.js for 7+ energy-utility clients, quickly becoming the most-used areas of the mobile app. Built shared utilities and Sketch plugins alongside the design team to cut repetitive work and lift code quality.",
    },
  ]

  let projects = [
    {
      name: "React Router",
      description:
        "Declarative routing for React, usable as a full framework or a lightweight library. Contributed as a Remix Core Team member, triaging issues and pull requests.",
      link: "https://github.com/remix-run/react-router",
    },
    {
      name: "Remix (React Router) Fastify",
      description:
        "Fastify server adapter and Vite development plugin for React Router framework mode, for serving Remix and React Router apps on Fastify.",
      link: "https://github.com/mcansh/remix-fastify",
    },
    {
      name: "vite-plugin-svg-sprite",
      description:
        "A Vite plugin that transforms any imported svg files and combine them into a cachable svg sprite sheet",
      link: "https://github.com/mcansh/vite-plugin-svg-sprite",
    },
  ]

  let designIndex = handle.props.designIndex ?? 0
  let fontIndex = handle.props.fontIndex ?? 0
  return () => (
    <main
      mix={css({
        paddingInline: "1rem",
        paddingBlock: "4rem",
        "@media (width >= 40rem)": { paddingBlock: "6rem" },
        "@media (width >= 64rem)": { paddingBlock: "8rem" },
      })}
    >
      {/* Hero Section */}
      <section
        mix={css({
          maxWidth: "48rem",
          marginInline: "auto",
          marginBottom: "5rem",
          textAlign: "center",
          "@media (width >= 64rem)": { marginBottom: "7rem" },
        })}
      >
        <img
          mix={css({
            width: "8rem",
            height: "8rem",
            borderRadius: "calc(infinity * 1px)",
            outline: "1px solid",
            outlineColor: "rgb(0 0 0 / 0.05)",
            "@media (prefers-color-scheme: dark)": {
              outlineColor: "rgb(255 255 255 / 0.1)",
            },
            marginInline: "auto",
            marginBottom: "1.5rem",
          })}
          width={handle.props.me.size}
          height={handle.props.me.size}
          alt="Logan McAnsh"
          fetchPriority="high"
          src={handle.props.me.url}
          srcSet={handle.props.me.srcSet}
        />
        <h1
          mix={css({
            fontSize: "var(--text-4xl)",
            lineHeight: "var(--text-4xl--line-height)",
            fontWeight: 500,
            textWrap: "balance",
            maxWidth: "35ch",
            marginInline: "auto",
            marginBottom: "0.75rem",
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
            marginInline: "auto",
            color: "rgb(0 0 0 / 0.6)",
            "@media (prefers-color-scheme: dark)": {
              color: "rgb(255 255 255 / 0.7)",
            },
          })}
        >
          Senior Software Engineer — Building tools & frameworks
        </p>
      </section>

      {/* Experience Section */}
      <section
        mix={css({
          maxWidth: "48rem",
          marginInline: "auto",
          marginBottom: "5rem",
          "@media (width >= 64rem)": { marginBottom: "7rem" },
        })}
      >
        <div
          mix={css({
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.5rem",
          })}
        >
          <h2
            mix={css({
              fontSize: "var(--text-2xl)",
              lineHeight: "var(--text-2xl--line-height)",
              fontWeight: 500,
              textWrap: "balance",
            })}
          >
            Experience
          </h2>
        </div>
        <div mix={spaceY("1.5rem")}>
          {experience.map((job, index) => (
            <article
              key={job.company}
              mix={css({
                paddingLeft: "1.5rem",
                borderLeft: "1px solid",
                borderColor: "rgb(0 0 0 / 0.1)",
                "@media (prefers-color-scheme: dark)": {
                  borderColor: "rgb(255 255 255 / 0.1)",
                },
                "&:last-child": {
                  borderLeftColor: "transparent",
                  paddingLeft: "1.5rem",
                },
              })}
            >
              <div mix={spaceY("0.25rem")}>
                <h3
                  mix={css({
                    fontSize: "var(--text-lg)",
                    lineHeight: "var(--text-lg--line-height)",
                    fontWeight: 500,
                    textWrap: "balance",
                  })}
                >
                  {job.role}
                </h3>
                <p
                  mix={css({
                    fontSize: "var(--text-base)",
                    lineHeight: "var(--text-base--line-height)",
                    color: "rgb(0 0 0 / 0.6)",
                    "@media (prefers-color-scheme: dark)": {
                      color: "rgb(255 255 255 / 0.7)",
                    },
                  })}
                >
                  {job.company} · {job.period}
                </p>
              </div>
              <p
                mix={css({
                  marginTop: "0.5rem",
                  fontSize: "var(--text-base)",
                  lineHeight: "var(--text-base--line-height)",
                  textWrap: "pretty",
                  color: "rgb(0 0 0 / 0.7)",
                  "@media (prefers-color-scheme: dark)": {
                    color: "rgb(255 255 255 / 0.8)",
                  },
                })}
              >
                {job.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section
        mix={css({
          maxWidth: "48rem",
          marginInline: "auto",
        })}
      >
        <h2
          mix={css({
            fontSize: "var(--text-2xl)",
            lineHeight: "var(--text-2xl--line-height)",
            fontWeight: 500,
            textWrap: "balance",
            marginBottom: "1.5rem",
          })}
        >
          Featured Projects
        </h2>
        <div
          mix={css({
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1rem",
            "@media (width >= 48rem)": {
              gridTemplateColumns: "repeat(2, 1fr)",
            },
            "@media (width >= 64rem)": {
              gridTemplateColumns: "repeat(3, 1fr)",
            },
          })}
        >
          {projects.map((project) => (
            <article
              key={project.name}
              mix={css({
                display: "flex",
                flexDirection: "column",
                padding: "1.5rem",
                border: "1px solid",
                borderColor: "rgb(0 0 0 / 0.1)",
                borderRadius: "0.5rem",
                backgroundColor: "rgb(0 0 0 / 0.02)",
                transition: "border-color 0.15s ease, background-color 0.15s ease",
                "@media (prefers-color-scheme: dark)": {
                  borderColor: "rgb(255 255 255 / 0.1)",
                  backgroundColor: "rgb(255 255 255 / 0.03)",
                },
                "&:hover": {
                  borderColor: "rgb(0 0 0 / 0.2)",
                  backgroundColor: "rgb(0 0 0 / 0.04)",
                  "@media (prefers-color-scheme: dark)": {
                    borderColor: "rgb(255 255 255 / 0.2)",
                    backgroundColor: "rgb(255 255 255 / 0.05)",
                  },
                },
              })}
            >
              <h3
                mix={css({
                  fontSize: "var(--text-lg)",
                  lineHeight: "var(--text-lg--line-height)",
                  fontWeight: 500,
                  textWrap: "balance",
                  marginBottom: "0.5rem",
                })}
              >
                {project.name}
              </h3>
              <p
                mix={css({
                  fontSize: "var(--text-sm)",
                  lineHeight: "var(--text-sm--line-height)",
                  textWrap: "pretty",
                  color: "rgb(0 0 0 / 0.7)",
                  marginBottom: "1rem",
                  "@media (prefers-color-scheme: dark)": {
                    color: "rgb(255 255 255 / 0.8)",
                  },
                })}
              >
                {project.description}
              </p>
              <a
                href={project.link}
                mix={css({
                  display: "inline-flex",
                  alignItems: "center",
                  alignSelf: "flex-start",
                  gap: "0.375rem",
                  marginTop: "auto",
                  fontSize: "var(--text-sm)",
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
                View on GitHub
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* Footer Links */}
      <footer
        mix={css({
          marginTop: "5rem",
          textAlign: "center",
          "@media (width >= 64rem)": { marginTop: "7rem" },
        })}
      >
        <div
          mix={css({
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "1.5rem",
          })}
        >
          <a
            href="https://github.com/mcansh"
            mix={css({
              fontSize: "var(--text-sm)",
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
            GitHub
          </a>
          <a
            href={routes.resume.href()}
            mix={css({
              fontSize: "var(--text-sm)",
              fontWeight: 500,
              color: "inherit",
              textDecoration: "none",
              borderBottom: "1px solid currentColor",
              paddingBottom: "2px",
              transition: "opacity 0.15s ease",
              "&:hover": { opacity: 0.7 },
            })}
          >
            Resume
          </a>
          <a
            href="https://linkedin.com/in/loganmcanish"
            mix={css({
              fontSize: "var(--text-sm)",
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
            LinkedIn
          </a>
        </div>
      </footer>
      <DesignSwitcher designIndex={designIndex} fontIndex={fontIndex} />
    </main>
  )
}
