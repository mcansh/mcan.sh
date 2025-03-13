import { FunHoverLink } from "#app/components/fun-link-hover.js";
import { getMugshotURL } from "#app/lib.server/cloudinary.js";
import type { RouteHandle } from "#app/types/handle.js";
import { cacheHeader } from "pretty-cache-header";
import { data } from "react-router";
import type { Route } from "./+types/home";

export function loader() {
	let srcSet = [240, 480, 720].map((size, index) => {
		let url = getMugshotURL({
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

export function meta({ data }: Route.MetaArgs): Route.MetaDescriptors {
	return data?.meta ?? [];
}

export let handle: RouteHandle = {
	bodyClassName: "h-full font-thin dark:bg-slate-900 dark:text-white",
};

export default function IndexPage({ loaderData }: Route.ComponentProps) {
	return (
		<div className="mx-auto flex h-screen max-w-screen-md flex-col items-center justify-between px-4 text-center">
			<div className="flex flex-1 flex-col items-center justify-center">
				<img
					width={loaderData.me.size}
					height={loaderData.me.size}
					alt=""
					className="mx-auto size-60 rounded-full"
					fetchPriority="high"
					src={loaderData.me.url}
					srcSet={loaderData.srcSet}
				/>
				<div className="mt-4 space-y-2">
					<h1 className="text-4xl">Logan McAnsh</h1>
					<p className="max-w-xs text-center text-lg sm:text-xl md:max-w-sm">
						Senior Software Engineer
					</p>
					<h2>Current: United Wholesale Mortgage</h2>
					<pre className="font-thin">Past: Shopify x Remix</pre>
				</div>
			</div>
			<div className="flex space-x-4 pt-5 pb-8 [@media(display-mode:standalone)]:pb-0">
				<FunHoverLink to="https://github.com/mcansh">GitHub</FunHoverLink>
				<FunHoverLink to="/resume" prefetch="intent">
					Resume
				</FunHoverLink>
			</div>
		</div>
	);
}
