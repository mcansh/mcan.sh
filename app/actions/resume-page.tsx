import { css } from "remix/ui"

import { routes } from "../routes.ts"
import { Document } from "./document.tsx"

const resumeStyle = css({
  colorScheme: "light dark",
  "& body": { margin: 0 },
  "& main": {
    maxWidth: "52rem",
    marginInline: "auto",
    padding: "clamp(1.25rem, 5vw, 4rem)",
    lineHeight: 1.6,
    overflowWrap: "anywhere",
  },
  "& h1": { fontSize: "2.5rem", fontWeight: 700, lineHeight: 1.2 },
  "& h2": {
    fontSize: "1.125rem",
    fontWeight: 700,
    marginBlock: "2rem 0.75rem",
    paddingBottom: "0.375rem",
    borderBottom: "1px solid currentColor",
  },
  "& h3": { fontSize: "1rem", fontWeight: 700, marginBlock: "1.5rem 0.25rem" },
  "& p": { marginBlock: "0.75rem" },
  "& ul": { listStyleType: "disc", paddingInlineStart: "1.25rem", marginBlock: "0.75rem" },
  "& li": { marginBlock: "0.375rem" },
  "& a": { color: "inherit", textUnderlineOffset: "0.2em", textDecoration: "underline" },
  "& a:focus-visible": { outline: "2px solid currentColor", outlineOffset: "4px" },
  "& code": { fontSize: "0.9em" },
  "& nav": { marginBottom: "2rem", fontSize: "0.875rem" },
  "@media print": {
    colorScheme: "light",
    "& body": { backgroundColor: "white", color: "black" },
    "& main": { maxWidth: "none", padding: 0, fontSize: "10pt", lineHeight: 1.4 },
    "& nav": { display: "none" },
    "& h1": { fontSize: "22pt" },
    "& h2": { marginTop: "1rem" },
    "& h3": { marginTop: "0.75rem" },
    "& h1, & h2, & h3": { breakAfter: "avoid" },
    "& li": { breakInside: "avoid" },
    "& p": { orphans: 3, widows: 3 },
  },
})

export function ResumePage() {
  return () => (
    <Document
      title="Resume | Logan McAnsh"
      fontIndex={0}
      mix={resumeStyle}
      head={
        <meta
          name="description"
          content="Logan McAnsh’s resume — senior software engineer focused on web frameworks, developer tooling, and application architecture."
        />
      }
    >
      <main>
        <nav aria-label="Resume navigation">
          <a href={routes.home.href()}>← Home</a>
        </nav>
        <h1>Logan McAnsh</h1>
        <p>Senior Software Engineer</p>
        <p>
          Shelby Township, MI · <a href="mailto:logan+resume@mcan.sh">logan+resume@mcan.sh</a> ·{" "}
          <a href="https://mcan.sh">mcan.sh</a> · <a href="https://github.com/mcansh">GitHub</a> ·{" "}
          <a href="https://linkedin.com/in/loganmcansh">LinkedIn</a>
        </p>
        <p>
          Senior software engineer focused on web frameworks, developer tooling, and application
          architecture. Former Remix Core Team member with experience building routing conventions,
          testing tools, release automation, and deployment integrations. Currently building
          developer tools and modernizing the technology stack at United Wholesale Mortgage.
        </p>
        <h2>Experience</h2>
        <h3>United Wholesale Mortgage</h3>
        <p>Senior Frontend Developer · June 2024–Present</p>
        <ul>
          <li>
            Built a global navigation web component for all uwm.com branded websites, with
            self-contained data fetching and fallbacks to keep navigation usable when requests fail.
          </li>
          <li>
            Built a type-safe Vault client for retrieving application secrets, using Standard Schema
            to validate secret data at runtime.
          </li>
          <li>Helped the internal design system team set up its build process.</li>
        </ul>
        <h3>Remix Software / Shopify</h3>
        <p>
          Senior Software Engineer · August 2021–May 2023
          <br />
          Remix Core Team; at Shopify beginning August 2022.
        </p>
        <ul>
          <li>
            Implemented Remix’s flat-routes convention, incorporating team proposals and community
            feedback.
          </li>
          <li>
            Created <code>@remix-run/testing</code> to support component tests using Remix’s routing
            and data APIs, including Link, Form, and fetchers.
          </li>
          <li>
            Built Playwright testing infrastructure to improve test suite speed and reliability,
            plus deployment testing across Vercel, Netlify, AWS, and Fly.io.
          </li>
          <li>
            Established automated nightly releases so developers could test upcoming features; built
            a GitHub Action to notify linked issues and pull requests when fixes shipped.
          </li>
          <li>
            Built SQLite-backed documentation infrastructure that generated HTML from Markdown and
            synchronized content with GitHub updates.
          </li>
          <li>
            Developed and maintained deployment adapters that translated platform-specific requests
            and responses into standard web Request and Response objects.
          </li>
          <li>
            Triaged Remix and React Router issues and pull requests, supported developers in
            Discord, and created examples for common implementation challenges.
          </li>
        </ul>
        <h3>Powerley</h3>
        <p>Frontend Web Developer · May 2016–July 2021</p>
        <ul>
          <li>
            Led development of white-label Next.js applications for more than seven energy utility
            clients, delivering experiences that became some of the mobile app’s most-used areas.
          </li>
          <li>
            Built shared utilities to reduce repetitive development work and improve code quality
            across the application suite.
          </li>
          <li>
            Collaborated with designers to build Sketch plugins that automated repetitive tasks,
            including artboard creation.
          </li>
        </ul>
        <h2>Selected Projects</h2>
        <ul>
          <li>
            <strong>
              <a href="https://github.com/mcansh/remix-fastify">Remix / React Router Fastify</a>:
            </strong>{" "}
            Fastify server adapter and Vite development plugin for serving Remix and React Router
            applications.
          </li>
          <li>
            <strong>
              <a href="https://github.com/mcansh/vite-plugin-svg-sprite">vite-plugin-svg-sprite</a>:
            </strong>{" "}
            Vite plugin that combines imported SVG files into a cacheable sprite sheet.
          </li>
        </ul>
        <h2>Skills</h2>
        <ul>
          <li>
            <strong>Web:</strong> TypeScript, React, Remix, React Router, Next.js, Tailwind CSS,
            accessibility, performance
          </li>
          <li>
            <strong>Server and data:</strong> Node.js, Cloudflare Workers, PostgreSQL, SQLite,
            Prisma, GraphQL, REST APIs
          </li>
          <li>
            <strong>Developer tooling:</strong> Vite, Playwright, Git, GitHub Actions, automated
            testing, continuous integration and delivery
          </li>
        </ul>
      </main>
    </Document>
  )
}
