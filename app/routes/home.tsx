import lucideFileTextIconHref from "#app/assets/lucide-file-text.svg";
import lucideGithubIconHref from "#app/assets/lucide-github.svg";
import { getMugshotURL } from "#app/lib.server/cloudinary.js";
import type { RouteHandle } from "#app/types/handle.js";
import { adapterContext } from "#workers/app.js";
import { cacheHeader } from "pretty-cache-header";
import { data, href, Link } from "react-router";
import type { Route } from "./+types/home";

export function loader({ context }: Route.LoaderArgs) {
	let env = context.get(adapterContext);
	let srcSet = [240, 480, 720].map((size, index) => {
		let url = getMugshotURL(env.CLOUDINARY_CLOUD_NAME, {
			resize: { type: "fill", width: size, height: size },
		});

		return { url, size, density: index + 1 };
	});

	let me = srcSet.at(1);
	if (me === undefined) throw new Error("Failed to get mugshot");

	return data(
		{
			me: { url: me.url.href, size: me.size },
			srcSet: srcSet.map((x) => `${x.url} ${x.density}x`).join(", "),
			meta: [
				{ title: "Logan McAnsh" },
				{ name: "description", content: "personal website for Logan McAnsh" },
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
				Link: `<${me.url.origin}>; rel=preconnect`,
			},
		},
	);
}

export function headers({
	loaderHeaders,
}: Route.HeadersArgs): Headers | HeadersInit {
	let documentHeaders = new Headers();
	let cacheControl = loaderHeaders.get("Cache-Control");
	let link = loaderHeaders.get("Link");

	if (cacheControl) {
		documentHeaders.set("Cache-Control", cacheControl);
	}
	if (link) {
		documentHeaders.set("Link", link);
	}
	return documentHeaders;
}

export function meta({ data }: Route.MetaArgs): Route.MetaDescriptors {
	return data?.meta ?? [];
}

export let handle: RouteHandle = {
	bodyClassName: "h-full font-thin dark:bg-slate-900 dark:text-white",
};

export default function IndexPage({ loaderData }: Route.ComponentProps) {
	return (
		<div className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
			{/* Gradient background */}
			<div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 -z-10" />

			{/* Animated circles in background */}
			<div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
			<div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000" />

			<div className="mx-auto relative z-10">
				<div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
					{/* Profile Image */}
					<div className="flex-shrink-0">
						<div className="relative">
							<div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-lg opacity-40 animate-pulse" />
							<img
								src={loaderData.me.url}
								width={loaderData.me.size}
								height={loaderData.me.size}
								alt="Logan McAnsh"
								className="relative w-64 h-64 rounded-full object-cover border-4 border-white shadow-2xl"
							/>
						</div>
					</div>

					{/* Content */}
					<div className="flex-1 text-center md:text-left">
						<div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full">
							✨ Available for opportunities
						</div>

						<h1 className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-3xl">
							Logan McAnsh
						</h1>

						<h2 className="mt-4 text-gray-700">Senior Software Engineer</h2>

						<div className="space-y-3 mt-6 text-gray-600">
							<div className="flex items-center gap-2 justify-center md:justify-start">
								<span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
								<span>Current: United Wholesale Mortgage</span>
							</div>
							<div className="flex items-center gap-2 justify-center md:justify-start">
								<span className="w-2 h-2 bg-gray-400 rounded-full" />
								<span>Past: Shopify × Remix</span>
							</div>
						</div>

						{/* Social Links */}
						<div className="mt-8 flex gap-4 justify-center md:justify-start">
							<a
								href="https://github.com/mcansh"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
							>
								<svg className="size-5" aria-hidden>
									<use href={lucideGithubIconHref} />
								</svg>
								<span>GitHub</span>
							</a>
							<Link
								to={href("/resume")}
								className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl border border-gray-200"
							>
								<svg className="size-5" aria-hidden>
									<use href={lucideFileTextIconHref} />
								</svg>
								<span>Resume</span>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
