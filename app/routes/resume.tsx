import type { HeadersFunction, LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { cacheHeader } from "pretty-cache-header";

import { Svg } from "~/components/sprite";
import spriteHref from "~/components/sprite/index.svg";
import type { RouteHandle } from "~/types/handle";

export function loader() {
	return json(
		{
			experience: [
				{
					company: "Shopify",
					position: "Senior Software Engineer",
					startDate: "August 2022",
					endDate: "May 2023",
					note: "(Note: Acquired by Shopify in August 2022 as part of the Remix acquisition)",
					tasks: [
						"Contributed as a key member of the Remix Core Team at Shopify.",
						"Developed and implemented a new flat route routing convention.",
						"Created the @remix-run/testing package to enable unit testing of components using Remix's Link, Form, Fetchers, etc.",
						"Published a custom GitHub Action that automatically added comments to resolved issues and pull requests in nightly/pre/stable releases.",
					],
				},
				{
					company: "Remix Software",
					position: "Senior Software Engineer",
					startDate: "August 2021",
					endDate: "August 2022",
					tasks: [
						"Played a significant role in the Remix Core Team",
						"Established the nightly release pipeline, enabling the shipment of Remix nightly builds to npm.",
						"Implemented cutting-edge documentation infrastructure ideas from Ryan Florence and Kurt Mackey, utilizing a SQLite DB to store generated HTML from markdown and keeping it synchronized with GitHub updates.",
						"Successfully migrated integration tests from Puppeteer to Playwright.",
						"Developed robust deployment target testing infrastructure for first-party targets.",
						"Created adapters to convert between proprietary request/response objects and native Request/Response objects.",
					],
				},
				{
					company: "Powerley",
					position: "Frontend Web Developer",
					startDate: "May 2016",
					endDate: "July 2021",
					tasks: [
						"Spearheaded the development of a suite of modern white-label web applications using Next.js, significantly enhancing the mobile app offerings for more than 7 clients.",
						"Maintained and supported the suite, which quickly became the most utilized aspect of the app.",
						"Implemented a range of utility functions that improved the efficiency and consistency of web experiences.",
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
				"Node.js",
				"Git",
				"React.js",
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
			links: [
				{
					href: "https://github.com/mcansh",
					text: "GitHub",
					icon: "github-mark",
				},
				{
					href: "https://x.com/loganmcansh",
					text: "X",
					icon: "x",
				},
				{
					href: "https://linkedin.com/in/loganmcansh",
					text: "LinkedIn",
					icon: "linkedin",
				},
			] as const,
		},
		{
			headers: {
				"Cache-Control": cacheHeader({
					public: true,
					maxAge: "1 hour",
					staleWhileRevalidate: "2 hours",
					sMaxage: "1 hour",
				}),
				"x-hello-recruiters": "1",
				// preload the sprite
				Link: `<${spriteHref}>; rel=preload; as=image; type=image/svg+xml`,
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

export const links: LinksFunction = () => {
	return [
		{
			rel: "preload",
			href: spriteHref,
			as: "image",
			type: "image/svg+xml",
		},
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

export let handle: RouteHandle = {
	bodyClassName: "dark:bg-white dark:text-black",
};

export default function ResumePage() {
	let data = useLoaderData<typeof loader>();

	return (
		<div className="flex h-full flex-col">
			<header className="flex flex-col items-center justify-center space-y-2 bg-stone-800 py-6 text-center text-white print:py-3">
				<h1 className="text-3xl print:text-xl">Logan McAnsh</h1>
				<p className="text-lg print:text-base">Senior Software Engineer</p>
			</header>

			<div className="grid h-full flex-1 gap-8 md:grid-cols-[300px,1fr] print:grid-cols-[175px,1fr] print:gap-4">
				<aside className="space-y-8 bg-stone-300 p-8 md:text-right print:space-y-4 print:p-4 print:py-2">
					<div className="print:text-[9pt]">
						<h2 className="text-lg font-medium print:text-[11pt]">Contact</h2>
						<ul className="space-y-1 print:space-y-0.5">
							<li>
								<a href="mailto:logan+resume@mcan.sh">logan+resume@mcan.sh</a>
							</li>
							<li>Shelby Township, MI</li>

							{data.links.map((link) => {
								let { pathname } = new URL(link.href);
								return (
									<li key={link.text}>
										<a
											className="flex items-center space-x-2 text-blue-800 underline md:justify-end"
											href={link.href}
										>
											<span className="print:hidden">{link.text}</span>
											<span className="hidden print:inline">{pathname}</span>
											<Svg className="h-4 w-4 text-black" name={link.icon} />
										</a>
									</li>
								);
							})}
						</ul>
					</div>

					<div className="print:text-[9pt]">
						<h2 className="text-lg font-medium print:text-[11pt]">Skills</h2>
						<ul className="space-y-1 print:space-y-0.5">
							{data.skills.map((skill) => {
								return <li key={skill}>{skill}</li>;
							})}
						</ul>
					</div>

					<div className="print:text-[9pt]">
						<h2 className="text-lg font-medium print:text-[11pt]">
							Certifications
						</h2>
						<ul className="space-y-1 print:space-y-0.5">
							{data.certifications.map((certification) => {
								return <li key={certification}>{certification}</li>;
							})}
						</ul>
					</div>
				</aside>

				<main className="p-8 md:py-8 md:pl-0 md:pr-8 print:px-0 print:py-2 print:text-[9pt]">
					<h2 className="text-lg font-medium print:text-[11pt]">
						Work Experience
					</h2>
					<ul className="space-y-8 print:space-y-4">
						{data.experience.map((job) => {
							return (
								<li key={job.company}>
									<h3 className="text-xl print:text-[10pt] print:font-medium">
										{job.company}
									</h3>
									<p>{job.position}</p>
									<p>
										{job.startDate} - {job.endDate}{" "}
										{"note" in job ? (
											<span className="block text-sm italic text-gray-600 md:inline">
												{job.note}
											</span>
										) : null}
									</p>

									<ul className="list-inside list-disc space-y-1 pt-2 print:space-y-0.5">
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
