import type { HeadersFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return {
    title: "Resume | Logan McAnsh",
    description: "Logan McAnsh's Resume",
  };
};

export const headers: HeadersFunction = () => {
  return {
    "Cache-Control": `public, max-age=3600, s-maxage=3600, stale-while-revalidate`,
    "x-hello-recruiters": "1",
    Link: "<https://res.cloudinary.com>; rel=preconnect",
  };
};

export const loader = () => {
  let date = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  });

  let skills = [
    "Node.js",
    "React",
    "Remix",
    "React Router",
    "TypeScript",
    "TailwindCSS",
    "Accessibility",
    "Performance",
    "ES2015+",
    "Git",
    "Automated Testing",
    "GitHub Actions",
    "Continuous Integration",
    "Continuous Delivery",
    "Prisma",
    "Center Stack",
  ];

  let experiences = [
    {
      company: "Shopify",
      title: "Senior Software Engineer",
      start: new Date(2022, 7, 29),
      duties: ["working on Remix"],
    },
    {
      company: "Remix Software",
      title: "Senior Software Engineer",
      start: new Date(2021, 7, 2),
      end: new Date(2022, 7, 28),
      duties: ["Core Team"],
    },
    {
      company: "Powerley",
      title: "Frontend Web Developer",
      start: new Date(2016, 4, 4),
      end: new Date(2021, 6, 23),
      duties: [
        "First member of the web team",
        "Created and maintained a suite of modern white label web applications with Next.js to be included in our mobile apps for 7+ clients, which quickly became the most used areas of the app",
        "Implemented a suite of utility functions used across our web experiences",
        "Designed Sketch plugins",
      ],
    },
  ].map((exp) => {
    return {
      ...exp,
      start: date.format(exp.start),
      end: exp.end ? date.format(exp.end) : undefined,
      startISO: exp.start.toISOString().slice(0, 7),
      endISO: exp.end?.toISOString().slice(0, 7),
      current: exp.end ? undefined : true,
    };
  });

  let certifications = [
    {
      link: "https://www.ciwcertified.com/ciw-certifications/web-foundations-series/internet-business-associate",
      label: "CIW Internet Business Associate",
      year: 2014,
    },
    {
      link: "https://www.ciwcertified.com/ciw-certifications/web-foundations-series/site-development-associate",
      label: "CIW Web Site Development Associate",
      year: 2015,
    },
    {
      link: "https://testingjavascript.com",
      label: "Testing JavaScript",
      year: [2019, 2021],
    },
  ];

  return json({
    certifications,
    skills: skills.sort(() => Math.random() - 0.5),
    experiences,
  });
};

export default function ResumePage() {
  let data = useLoaderData<typeof loader>();

  return (
    <div className="relative h-full border-t-8 border-indigo-600 border-solid pb-8-safe">
      <div className="py-4 mx-auto max-w-prose">
        <header className="flex flex-col items-center px-4 pb-2 mb-2 space-x-4 space-y-1 text-center sm:flex-row sm:text-left">
          <div className="relative w-32 h-32 overflow-hidden rounded-full sm:w-40 sm:h-40">
            <div className="w-full h-full scale-125 bg-cover" />
            <img
              alt="Me standing on a rock in front of an American flag with a beer in hand"
              src="https://res.cloudinary.com/dof0zryca/image/upload/c_fill,f_auto,w_340/v1624726620/11698668.jpg"
              height={160}
              width={160}
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
          <div>
            <h1 className="text-4xl font-semibold">Logan McAnsh</h1>
            <a
              className="transition-colors duration-75 ease-in-out text-slate-600 hover:text-slate-300 hover:underline"
              href="mailto:logan+resume@mcan.sh"
            >
              logan+resume@mcan.sh
            </a>
          </div>
        </header>

        <div className="px-4 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold">Summary</h2>
            <p>
              Experienced Full Stack Web Developer, primarily using React and
              Node.js.
              <br />
              Self taught with experience working solo and with a team, both in
              person and remote settings.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Skills</h2>
            {/* safari doesn't support gap on flex containers, so we need to add a margin to each flex child and set a negative margin on the parent */}
            <ul className="flex flex-row flex-wrap -mx-1 supports-[gap]:gap-2 supports-[gap]:mx-0 supports-[gap]:my-1">
              {data.skills.map((skill) => (
                <li
                  key={skill}
                  className="px-2 py-1 m-1 tracking-wide text-white bg-indigo-600 rounded-md supports-[gap]:m-0"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Experience</h2>
            <ul>
              {data.experiences.map((experience) => (
                <li
                  className="space-y-2"
                  key={`${experience.company}-${experience.start}`}
                >
                  <div>
                    <h3 className="flex flex-col py-2 sm:space-y-0 sm:space-x-2 sm:items-baseline sm:flex-row">
                      <span className="text-xl font-medium">
                        {experience.company}
                      </span>
                      <span className="text-lg">{experience.title}</span>
                      <span>
                        <time dateTime={experience.startISO}>
                          {experience.start}
                        </time>
                        {" - "}
                        {"current" in experience ? (
                          <span>Present</span>
                        ) : (
                          <time dateTime={experience.endISO}>
                            {experience.end}
                          </time>
                        )}
                      </span>
                    </h3>
                    {experience.duties.length > 0 ? (
                      <ul className="pl-6 space-y-1 list-disc">
                        {experience.duties.map((duty) => (
                          <li key={duty}>{duty}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Certificates</h2>
            <ul className="pl-6 list-disc">
              {data.certifications.map((certificate) => (
                <li key={certificate.label}>
                  <a
                    className="text-indigo-600 hover:underline"
                    href={certificate.link}
                  >
                    {certificate.label}
                  </a>{" "}
                  (
                  {Array.isArray(certificate.year)
                    ? certificate.year.join(", ")
                    : certificate.year}
                  )
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
