import type { HeadersFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { cacheHeader } from "pretty-cache-header";
import { renderToStaticMarkup } from "react-dom/server";

import { getMugshotURL } from "~/cloudinary.server";
import { Svg } from "~/components/sprite";

export function loader() {
	let { format: formatDate } = new Intl.DateTimeFormat("en-US", {
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
		"Git",
		"Automated Testing",
		"GitHub Actions",
		"Continuous Integration",
		"Continuous Delivery",
		"Prisma",
		"GraphQL",
		"Rest APIs",
	];

	let experiences = [
		{
			company: "Shopify",
			title: "Senior Software Engineer",
			start: new Date(2022, 7, 29),
			end: new Date(2023, 4, 4),
			duties: [
				"Remix Core Team",
				renderToStaticMarkup(
					<>
						Set up the{" "}
						<a
							className="text-indigo-600 hover:underline dark:text-indigo-300"
							href="https://github.com/remix-run/remix/blob/main/.github/workflows/nightly.yml"
						>
							nightly release pipeline
						</a>{" "}
						so we can ship Remix nightly builds to npm
					</>,
				),
				renderToStaticMarkup(
					<>
						Set up the{" "}
						<a
							className="text-indigo-600 hover:underline dark:text-indigo-300"
							href="https://github.com/remix-run/react-router-website/tree/dc45120e7b7523dc91437c655a28e10b481e1d6f"
						>
							initial docs website infrastructure
						</a>{" "}
						that used a SQLite DB to store the generated html from markdown and
						updated when docs were updated on GitHub
					</>,
				),
				"Converted our integration tests from Puppeteer to Playwright",
				"Deployment target testing infrastructure for each of our first party targets",
				"Built adapters to convert to/from proprietary request/response objects to native Request/Response objects",
				renderToStaticMarkup(
					<>
						Implemented a new{" "}
						<a
							className="text-indigo-600 hover:underline dark:text-indigo-300"
							href="https://github.com/remix-run/remix/discussions/4482"
						>
							flat route
						</a>{" "}
						routing convention
					</>,
				),
				renderToStaticMarkup(
					<>
						Created{" "}
						<a
							className="text-indigo-600 hover:underline dark:text-indigo-300"
							href="https://github.com/remix-run/remix/tree/main/packages/remix-testing"
						>
							@remix-run/testing
						</a>{" "}
						to allow unit testing components using Remix's Link, Form, Fetchers,
						etc
					</>,
				),
				renderToStaticMarkup(
					<>
						Published a custom{" "}
						<a
							className="text-indigo-600 hover:underline dark:text-indigo-300"
							href="https://github.com/remix-run/release-comment-action"
						>
							GitHub Action
						</a>{" "}
						to automatically comment on issues and PRs that were fixed in a
						nightly/pre/stable release
					</>,
				),
			],
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
				"Implemented a set of utility functions used across our web experiences",
				"Designed Sketch plugins",
			],
		},
	].map((exp) => {
		return {
			...exp,
			start: formatDate(exp.start),
			end: exp.end ? formatDate(exp.end) : undefined,
			startISO: exp.start.toISOString().slice(0, 7),
			endISO: exp.end?.toISOString().slice(0, 7),
			current: exp.end ? undefined : true,
		};
	});

	let links = [
		{
			link: "https://github.com/mcansh",
			label: "GitHub",
			icon: "github-mark",
		},
		{
			label: "LinkedIn",
			link: "https://www.linkedin.com/in/loganmcansh",
			icon: "linkedin",
		},
		{
			label: "X",
			link: "https://x.com/loganmcansh",
			icon: "x",
		},
	] as const;

	let certifications = [
		{
			link: "https://www.ciwcertified.com/ciw-certifications/web-foundations-series/internet-business-associate",
			label: "CIW Internet Business Associate",
			year: [2014],
		},
		{
			link: "https://www.ciwcertified.com/ciw-certifications/web-foundations-series/site-development-associate",
			label: "CIW Web Site Development Associate",
			year: [2015],
		},
		{
			link: "https://testingjavascript.com",
			label: "Testing JavaScript",
			year: [2019, 2021],
		},
	];

	return json(
		{
			certifications,
			skills,
			links,
			experiences,
			me: getMugshotURL({ resize: { height: 480, width: 480, type: "fill" } }),
		},
		{
			headers: {
				"Cache-Control": cacheHeader({
					public: true,
					maxAge: "1 hour",
					staleWhileRevalidate: "2 hours",
					sMaxage: "1 hour",
				}),
				Link: "<https://res.cloudinary.com>; rel=preconnect",
				"x-hello-recruiters": "1",
			},
		},
	);
}

export const meta: MetaFunction<typeof loader> = () => {
	return [
		{ title: "Resume | Logan McAnsh" },
		{ name: "description", content: "Logan McAnsh's Resume" },
	];
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
	let routeHeaders = new Headers();

	let cacheControlHeader = loaderHeaders.get("Cache-Control");
	let httpLinkHeader = loaderHeaders.get("Link");
	let xHelloRecruiters = loaderHeaders.get("x-hello-recruiters");

	if (cacheControlHeader) {
		routeHeaders.set("Cache-Control", cacheControlHeader);
	}
	if (httpLinkHeader) {
		routeHeaders.set("Link", httpLinkHeader);
	}
	if (xHelloRecruiters) {
		routeHeaders.set("x-hello-recruiters", xHelloRecruiters);
	}

	return routeHeaders;
};

export default function ResumePage() {
	let data = useLoaderData<typeof loader>();

	return (
		<div className="relative h-full border-t-8 border-solid border-indigo-600 pb-8-safe print:border-none media-standalone:border-none media-standalone:pt-10">
			<div className="mx-auto max-w-prose py-4">
				<header className="mb-2 flex flex-col items-center space-x-4 space-y-1 px-4 pb-2 text-center sm:flex-row sm:text-left">
					<div className="relative h-32 w-32 overflow-hidden rounded-full sm:h-40 sm:w-40">
						<div className="h-full w-full scale-125 bg-cover" />
						<img
							src={data.me}
							alt=""
							height={160}
							width={160}
							className="absolute left-0 top-0 h-full w-full"
						/>
					</div>
					<div>
						<h1 className="text-4xl font-semibold">Logan McAnsh</h1>
						<a
							className="text-slate-600 transition-colors duration-75 ease-in-out hover:text-slate-300 hover:underline dark:text-slate-400"
							href="mailto:logan+resume@mcan.sh"
						>
							logan+resume@mcan.sh
						</a>
					</div>
				</header>

				<div className="space-y-8 px-4">
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
						<ul className="supports-[gap]:gap -ml-1 flex flex-row flex-wrap space-x-1 space-y-1 supports-[gap]:ml-0 supports-[gap]:gap-1 supports-[gap]:space-x-0 supports-[gap]:space-y-0">
							{data.skills.map((skill) => (
								<li
									key={skill}
									className="rounded-md bg-indigo-600 px-2 py-1 tracking-wide text-white first-of-type:ml-1 first-of-type:mt-1 supports-[gap]:first-of-type:m-0"
								>
									{skill}
								</li>
							))}
						</ul>
					</div>
					<div>
						<h2 className="text-2xl font-semibold">Experience</h2>
						<ul>
							{data.experiences.map((experience) => {
								return (
									<li
										className="space-y-2"
										key={`${experience.company}-${experience.start}`}
									>
										<div>
											<h3 className="flex flex-col py-2">
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
												<ul className="list-disc space-y-1 pl-6">
													{experience.duties.map((duty) => {
														return (
															<li
																key={duty}
																dangerouslySetInnerHTML={{ __html: duty }}
															/>
														);
													})}
												</ul>
											) : null}
										</div>
									</li>
								);
							})}
						</ul>
					</div>
					<div>
						<h2 className="text-2xl font-semibold">Certificates</h2>
						<ul className="list-disc pl-6">
							{data.certifications.map((certificate) => {
								return (
									<li key={certificate.label}>
										<a
											className="text-indigo-600 hover:underline dark:text-indigo-300"
											href={certificate.link}
										>
											{certificate.label}
										</a>{" "}
										({certificate.year.join(", ")})
									</li>
								);
							})}
						</ul>
					</div>

					<div className="flex items-center justify-center space-x-4 print:hidden">
						{data.links.map((link) => {
							return (
								<a
									key={link.label}
									href={link.link}
									className="hover:opacity-80"
								>
									<div className="sr-only">{link.label}</div>
									<Svg name={link.icon} className="h-8 w-8" />
								</a>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
