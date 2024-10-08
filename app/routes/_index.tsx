import { unstable_data } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { cacheHeader } from "pretty-cache-header";

import { getMugshotURL } from "#app/cloudinary.server.js";
import { FunHoverLink } from "#app/components/fun-link-hover.js";
import type { RouteHandle } from "#app/types/handle.js";

export function loader() {
	let srcSet = [240, 480, 720].map((size, index) => {
		let url = getMugshotURL({
			resize: { type: "fill", width: size, height: size },
		});

		return { url, size, density: index + 1 };
	});

	let me = srcSet.at(1);
	if (me === undefined) throw new Error("Failed to get mugshot");

	return unstable_data(
		{
			me: { url: me.url.href, size: me.size },
			srcSet: srcSet.map((x) => `${x.url} ${x.density}x`).join(", "),
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

export const handle: RouteHandle = {
	bodyClassName: "h-full font-thin dark:bg-slate-900 dark:text-white",
};

export default function IndexPage() {
	let data = useLoaderData<typeof loader>();

	return (
		<div className="mx-auto flex h-screen max-w-screen-md flex-col items-center justify-between px-4 text-center">
			<div className="flex flex-1 flex-col items-center justify-center">
				<img
					width={data.me.size}
					height={data.me.size}
					alt=""
					className="mx-auto size-60 rounded-full"
					fetchPriority="high"
					src={data.me.url}
					srcSet={data.srcSet}
				/>
				<h1 className="mt-4 text-4xl">Logan McAnsh</h1>
				<p className="mt-2 max-w-xs text-center text-lg sm:text-xl md:max-w-sm">
					Senior Software Engineer
				</p>
				<h2 className="mt-2">Current: United Wholesale Mortgage</h2>
				<pre className="mt-2 font-thin">Past: Shopify x Remix</pre>
			</div>
			<div className="flex space-x-4 pb-8 media-standalone:pb-0">
				<FunHoverLink to="https://github.com/mcansh">GitHub</FunHoverLink>
				<FunHoverLink to="/resume" prefetch="intent">
					Resume
				</FunHoverLink>
			</div>
		</div>
	);
}
