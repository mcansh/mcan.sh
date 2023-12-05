import type { HeadersFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { cacheHeader } from "pretty-cache-header";

import { Svg } from "~/components/sprite";

export function loader() {
	return json(
		{
			experience: [
				{
					company: "Shopify",
					position: "Senior Software Engineer",
					startDate: "August 2022",
					endDate: "May 2023",
					tasks: [
						"Acquired by Shopify in August 2022 as part of the Remix acquisition",
						"Remix Core Team",
						"Implemented a new flat route routing convention",
						"Created @remix-run/testing to allow unit testing components using Remix's Link, Form, Fetchers, etc",
						"Published a custom GitHub Action to automatically comment on issues and PRs that were fixed in a nightly/pre/stable release",
					],
				},
				{
					company: "Remix Software",
					position: "Senior Software Engineer",
					startDate: "August 2021",
					endDate: "August 2022",
					tasks: [
						"Acquired by Shopify in August 2022",
						"Remix Core Team",
						"Set up the nightly release pipeline so we can ship Remix nightly builds to npm",
						"Implemented initial docs infrastructure ideas from Ryan Florence and Kurt Mackey (of Fly.io) that used a SQLite DB to store the generated html from markdown and updated when docs were updated on GitHub",
						"Converted our integration tests from Puppeteer to Playwright",
						"Deployment target testing infrastructure for each of our first party targets",
						"Built adapters to convert to/from proprietary request/response objects to native Request/Response objects",
					],
				},
				{
					company: "Powerley",
					position: "Frontend Web Developer",
					startDate: "May 2016",
					endDate: "July 2021",
					tasks: [
						"First member of the web team",
						"Created and maintained a suite of modern white label web applications with Next.js to be included in our mobile apps for 7+ clients, which quickly became the most used areas of the app",
						"Implemented a set of utility functions used across our web experiences",
						"Worked with the design team to create Sketch plugins to improve their workflow and reduce the amount of time spent on repetitive tasks such as creating new artboards for each utility we supported",
					],
				},
			],
			certifications: [
				"CIW Internet Business Associate",
				"CIW Web Site Development Associate",
				"Testing JavaScript",
			],
			skills: [
				"Node.js",
				"Git",
				"React",
				"Remix",
				"React Router",
				"TypeScript",
				"Next.js",
				"TailwindCSS",
				"Accessibility",
				"Performance",
				"Prisma",
				"GraphQL",
				"Rest APIs",
				"Automated Testing",
				"GitHub Actions",
				"Continuous Integration",
				"Continuous Delivery",
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
		<div>
			<header className="flex flex-col items-center justify-center space-y-2 bg-stone-800 py-6 text-center text-white">
				<h1 className="text-3xl">Logan McAnsh</h1>
				<p className="text-lg">Senior Software Engineer</p>
			</header>

			<div className="grid gap-8 md:grid-cols-[300px,1fr]">
				<aside className="space-y-8 bg-stone-300 p-8 md:text-right">
					<div>
						<h2 className="text-lg font-medium">Contact</h2>
						<ul className="space-y-1">
							<li>
								<a href="mailto:logan+resume@mcan.sh">logan+resume@mcan.sh</a>
							</li>
							<li>Shelby Township, MI</li>
							<li>
								<a
									className="flex items-center space-x-2 text-blue-600 underline md:justify-end"
									href="https://github.com/mcansh"
								>
									<span>GitHub</span>
									<Svg className="h-4 w-4 text-black" name="github-mark" />
								</a>
							</li>
							<li>
								<a
									className="flex items-center space-x-2 text-blue-600 underline md:justify-end"
									href="https://github.com/loganmcansh"
								>
									<span>Twitter</span>
									<Svg className="h-4 w-4 text-black" name="x" />
								</a>
							</li>
							<li>
								<a
									className="flex items-center space-x-2 text-blue-600 underline md:justify-end"
									href="https://linkedin.com/in/loganmcansh"
								>
									<span>LinkedIn</span>
									<Svg className="h-4 w-4 text-black" name="linkedin" />
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h2 className="text-lg font-medium">Skills</h2>
						<ul className="space-y-1">
							{data.skills.map((skill) => {
								return <li key={skill}>{skill}</li>;
							})}
						</ul>
					</div>

					<div>
						<h2 className="text-lg font-medium">Certifications</h2>
						<ul className="space-y-1">
							{data.certifications.map((skill) => {
								return <li key={skill}>{skill}</li>;
							})}
						</ul>
					</div>
				</aside>

				<main className="p-8 md:py-8 md:pr-8">
					<h2 className="text-lg font-medium">Work Experience</h2>
					<ul className="space-y-8">
						{data.experience.map((job) => {
							return (
								<li key={job.company}>
									<h3 className="text-xl">{job.company}</h3>
									<p className="">{job.position}</p>
									<p className="">
										{job.startDate} - {job.endDate}
									</p>

									<ul className="list-inside list-disc space-y-1 pt-2">
										{job.tasks.map((task) => {
											return <li key={task}>{task}</li>;
										})}
									</ul>
								</li>
							);
						})}
					</ul>
				</main>
			</div>
		</div>
	);
}
