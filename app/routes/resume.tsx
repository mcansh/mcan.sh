import githubMarkIconHref from "#app/assets/github-mark.svg";
import linkedinIconHref from "#app/assets/linkedin.svg";
import twitterIconHref from "#app/assets/twitter.svg";
import { cacheHeader } from "pretty-cache-header";
import { Link, data } from "react-router";
import spriteHref from "virtual:@mcansh/vite-plugin-svg-sprite";
import type { Route } from "./+types/resume";

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
				"Node.js",
				"Git",
				"React",
				"Remix",
				"React Router",
				"TypeScript",
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
				"x-hello-recruiters": "1",
				// preload the sprite
				Link: `<${spriteHref}>; rel=preload; as=image; type=image/svg+xml`,
			},
		},
	);
}

export function headers({
	loaderHeaders,
}: Route.HeadersArgs): Headers | HeadersInit {
	let documentHeaders = new Headers();
	let cacheControl = loaderHeaders.get("Cache-Control");
	let xHelloRecruiters = loaderHeaders.get("x-hello-recruiters");
	let link = loaderHeaders.get("Link");

	if (cacheControl) {
		documentHeaders.set("Cache-Control", cacheControl);
	}
	if (xHelloRecruiters) {
		documentHeaders.set("x-hello-recruiters", xHelloRecruiters);
	}
	if (link) {
		documentHeaders.set("Link", link);
	}
	return documentHeaders;
}

export function meta({ data }: Route.MetaArgs): Route.MetaDescriptors {
	return data?.meta ?? [];
}

export function links(): Route.LinkDescriptors {
	return [
		{ rel: "preload", href: spriteHref, as: "image", type: "image/svg+xml" },
	];
}

export default function ResumePage({ loaderData }: Route.ComponentProps) {
	let links = [
		{
			href: "https://github.com/mcansh",
			text: "GitHub",
			icon: githubMarkIconHref,
		},
		{
			href: "https://linkedin.com/in/loganmcansh",
			text: "LinkedIn",
			icon: linkedinIconHref,
		},
	] as const;

	let references = [
		{
			name: "Ryan Florence",
			twitter: "https://twitter.com/ryanflorence",
			icon: twitterIconHref,
		},
		{
			name: "Michael Jackson",
			twitter: "https://twitter.com/mjackson",
			icon: twitterIconHref,
		},
	] as const;

	return (
		<>
			<img src={spriteHref} loading="eager" className="hidden" />
			<div className="flex h-full flex-col">
				<header className="flex flex-col items-center justify-center space-y-2 bg-stone-800 py-6 text-center text-white print:py-3">
					<h1 className="text-3xl print:text-xl">
						<Link to="/" className="hover:underline">
							Logan McAnsh
						</Link>
					</h1>
					<p className="text-lg print:text-base">Senior Software Engineer</p>
				</header>

				<div className="grid h-full flex-1 gap-8 md:grid-cols-[300px_1fr] print:grid-cols-[175px_1fr] print:gap-4">
					<aside className="space-y-8 bg-stone-300 p-8 md:text-right print:space-y-4 print:p-4 print:py-2">
						<div className="print:text-[9pt]">
							<h2 className="text-lg font-medium print:text-[11pt]">Contact</h2>
							<ul className="space-y-1 print:space-y-0.5">
								<li>
									<a href="mailto:logan+resume@mcan.sh">logan+resume@mcan.sh</a>
								</li>
								<li>Shelby Township, MI</li>

								{links.map((link) => {
									let url = new URL(link.href);
									return (
										<li key={link.text}>
											<a
												className="flex items-center space-x-2 text-blue-800 underline md:justify-end"
												href={link.href}
											>
												<span className="print:hidden">{link.text}</span>
												<span className="hidden print:inline">
													{url.pathname}
												</span>
												<svg className="h-4 w-4 text-black" aria-hidden>
													<use href={link.icon}></use>
												</svg>
											</a>
										</li>
									);
								})}
							</ul>
						</div>

						<div className="print:text-[9pt] ">
							<h2 className="text-lg font-medium print:text-[11pt]">Skills</h2>
							<ul className="space-y-1 print:space-y-0.5">
								{loaderData.skills.map((skill) => {
									return <li key={skill}>{skill}</li>;
								})}
							</ul>
						</div>

						<div className="print:text-[9pt]">
							<h2 className="text-lg font-medium print:text-[11pt]">
								Certifications
							</h2>
							<ul className="space-y-1 print:space-y-0.5">
								{loaderData.certifications.map((certification) => {
									return <li key={certification}>{certification}</li>;
								})}
							</ul>
						</div>

						<div className="print:text-[9pt]">
							<h2 className="text-lg font-medium print:text-[11pt]">
								References
							</h2>
							<ul className="space-y-1 print:space-y-0.5">
								{references.map((reference) => {
									return (
										<li key={reference.name}>
											<h3>
												<a
													className="flex items-center space-x-2 text-blue-800 underline md:justify-end"
													href={reference.twitter}
												>
													<span>{reference.name}</span>
													<svg className="h-4 w-4 text-black" aria-hidden>
														<use href={reference.icon}></use>
													</svg>
												</a>
											</h3>
										</li>
									);
								})}
							</ul>
						</div>
					</aside>

					<main className="space-y-8 p-8 md:py-8 md:pr-8 md:pl-0 print:space-y-4 print:px-0 print:py-2 print:text-[9pt]">
						<div>
							<h2 className="text-lg font-medium print:text-[11pt]">
								Work Experience
							</h2>
							<ul className="mt-4 space-y-8 print:mt-2 print:space-y-4">
								{loaderData.experience.map((job) => {
									return (
										<li key={job.company}>
											<h3 className="text-xl print:text-[10pt] print:font-medium">
												{job.company}
											</h3>
											<p>{job.position}</p>
											<p>
												{job.startDate} - {job.endDate}{" "}
												{"note" in job ? (
													<span className="block text-sm text-gray-600 italic md:inline">
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
						</div>
					</main>
				</div>
			</div>
		</>
	);
}
