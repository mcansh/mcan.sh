import { cacheHeader } from "pretty-cache-header"
import { data } from "react-router"
import spriteHref from "virtual:@mcansh/vite-plugin-svg-sprite"

import twitterIconHref from "#app/assets/twitter.svg"

import type { Route } from "./+types/route"
import {
  CertificationsSection,
  ExperienceSection,
  ReferencesSection,
  ResumeHeader,
  SkillsSection,
} from "./components"

export function loader() {
  return data(
    {
      meta: [
        { title: "Resume | Logan McAnsh" },
        { name: "description", content: "Logan McAnsh's Resume" },
      ],
      experience: [
        {
          company: "United Wholesale Mortgage",
          position: "Senior UI Developer",
          startDate: "June 2024",
          endDate: "Current",
          tasks: [],
        },
        {
          company: "Shopify",
          position: "Senior Software Engineer",
          startDate: "August 2022",
          endDate: "May 2023",
          note: "(Note: via Remix)",
          tasks: [
            "Contributed as a key member of the Remix Core Team at Shopify.",
            "Moderated and triaged issues and pull requests for the React Router and Remix repositories.",
            "Developed and implemented a new `flat routes` routing convention based on teams ideas and community feedback.",
            "Created the `@remix-run/testing` package to enable unit testing of components using Remix's Link, Form, Fetchers, etc.",
            "Published a custom GitHub Action that automatically added comments to resolved issues and pull requests in nightly/pre/stable releases.",
            "Provided technical advice to developers to use best practices in our Discord server and created examples for common headaches.",
          ],
        },
        {
          company: "Remix Software",
          position: "Senior Software Engineer",
          startDate: "August 2021",
          endDate: "May 2023",
          tasks: [
            "Played a significant role in the Remix Core Team.",
            "Established the nightly release pipeline, which allows for the automatic generation of nightly builds and the ability to test new features before they are released.",
            "Implemented documentation infrastructure based on ideas from Ryan Florence and Kurt Mackey, utilizing a SQLite DB to store generated HTML from markdown and keeping it synchronized with GitHub updates.",
            "Developed a new testing infrastructure using Playwright, which significantly improved the speed and reliability of the test suite.",
            "Created a new deployment target testing infrastructure that allows for testing of Remix applications on different deployment targets, such as Vercel, Netlify, Amazon Web Services, and Fly.io",
            "Developed and maintained both first and third party adapters that convert the deployment target's proprietary request and response objects into JavaScript Request/Response objects that Remix can use to render the application",
          ],
        },
        {
          company: "Powerley",
          position: "Frontend Web Developer",
          startDate: "May 2016",
          endDate: "July 2021",
          tasks: [
            "Lead the development of a suite of modern white-label web applications using Next.js, significantly enhancing the mobile app offerings for more than 7 clients.",
            "Maintained and supported the suite, which quickly became the most utilized areas of the app.",
            "Created utility functions to reduce the time spent on repetitive tasks and improve the overall quality of the codebase.",
            "Collaborated closely with the design team to enhance their workflow and reduce time spent on repetitive tasks, such as creating new artboards, by creating Sketch plugins for utility support.",
          ],
        },
      ],
      certifications: [
        "CIW Internet Business Associate",
        "CIW Web Site Development Associate",
        "Testing JavaScript",
      ],
      skills: [
        {
          category: "Languages & Frameworks",
          skills: ["Node.js", "React", "TypeScript", "Remix", "React Router"],
        },
        {
          category: "Styling & Design",
          skills: ["TailwindCSS", "Accessibility"],
        },
        {
          category: "Backend & APIs",
          skills: ["Prisma", "Drizzle", "GraphQL", "Rest APIs"],
        },
        {
          category: "DevOps & Testing",
          skills: ["Git", "GitHub Actions", "Automated Testing", "CI/CD", "Performance"],
        },
      ],
    },
    {
      headers: {
        "Cache-Control": cacheHeader({
          public: true,
          maxAge: "1 hour",
          staleWhileRevalidate: "2 hours",
          sMaxage: "1 hour",
        }),
        "X-Hello-Recruiters": "1",
        // preload the sprite
        Link: `<${spriteHref}>; rel=preload; as=image; type=image/svg+xml`,
      },
    },
  )
}

export function headers({ loaderHeaders }: Route.HeadersArgs): Headers | HeadersInit {
  let documentHeaders = new Headers()
  let cacheControl = loaderHeaders.get("Cache-Control")
  let xHelloRecruiters = loaderHeaders.get("X-Hello-Recruiters")
  let link = loaderHeaders.get("Link")

  if (cacheControl) {
    documentHeaders.set("Cache-Control", cacheControl)
  }
  if (xHelloRecruiters) {
    documentHeaders.set("X-Hello-Recruiters", xHelloRecruiters)
  }
  if (link) {
    documentHeaders.set("Link", link)
  }
  return documentHeaders
}

export function meta({ data }: Route.MetaArgs): Route.MetaDescriptors {
  return data?.meta ?? []
}

export function links(): Route.LinkDescriptors {
  return [{ rel: "preload", href: spriteHref, as: "image", type: "image/svg+xml" }]
}

export const handle = {
  bodyClassName: "min-h-screen bg-neutral-50",
}

export default function ResumePage({ loaderData }: Route.ComponentProps) {
  let references = [
    {
      name: "Ryan Florence",
      href: "https://twitter.com/ryanflorence",
      icon: twitterIconHref,
    },
    {
      name: "Michael Jackson",
      href: "https://twitter.com/mjackson",
      icon: twitterIconHref,
    },
    {
      name: "Matt Brophy",
      href: "https://twitter.com/brophdawg11",
      icon: twitterIconHref,
    },
  ] as const

  return (
    <>
      <img src={spriteHref} loading="eager" className="hidden" />
      <div className="px-4 py-16 md:px-8">
        <div className="mx-auto max-w-[1000px] bg-white shadow-sm">
          <ResumeHeader />

          <div className="grid gap-12 px-8 py-12 md:grid-cols-3 md:px-16">
            <div className="col-span-2 space-y-10">
              <ExperienceSection experiences={loaderData.experience} />
            </div>

            <div className="col-span-2 space-y-10 md:col-span-1 md:border-l md:border-neutral-200 md:pl-8">
              <SkillsSection skills={loaderData.skills} />
              <CertificationsSection certifications={loaderData.certifications} />
              <ReferencesSection references={references} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
