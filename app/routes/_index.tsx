import { json } from "@remix-run/node";
import type { HeadersFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Image } from "@unpic/react";
import { cacheHeader } from "pretty-cache-header";

import { getMugshotURL } from "~/cloudinary.server";
import { FunHoverLink } from "~/components/fun-link-hover";

export function loader() {
	let me = getMugshotURL({ resize: { height: 480, width: 480, type: "fill" } });
	return json(
		{ me: me.toString() },
		{
			headers: {
				"Cache-Control": cacheHeader({
					public: true,
					maxAge: "1 hour",
					staleWhileRevalidate: "2 hours",
					sMaxage: "1 hour",
				}),
				Link: `<${me.origin}>; rel=preconnect`,
			},
		},
	);
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
	let responseHeaders = new Headers();
	let cacheControlHeader = loaderHeaders.get("Cache-Control");
	let linkHeader = loaderHeaders.get("Link");
	if (cacheControlHeader) {
		responseHeaders.set("Cache-Control", cacheControlHeader);
	}
	if (linkHeader) {
		responseHeaders.set("Link", linkHeader);
	}
	return responseHeaders;
};

export default function IndexPage() {
	let data = useLoaderData<typeof loader>();

	return (
		<div className="mx-auto flex h-screen max-w-screen-md flex-col items-center justify-between px-4 text-center">
			<div className="flex flex-1 flex-col items-center justify-center">
				<Image
					src={data.me}
					layout="fixed"
					cdn="cloudinary"
					width={240}
					height={240}
					alt=""
					className="mx-auto rounded-full"
					priority
				/>
				<h1 className="mt-4 text-4xl">Logan McAnsh</h1>
				<p className="mt-2 max-w-xs text-center text-lg sm:text-xl md:max-w-sm">
					Senior Software Engineer
				</p>
				<pre className="mt-2 font-thin">Past: Shopify x Remix</pre>
			</div>
			<div className="pb-8 media-standalone:pb-0">
				<FunHoverLink to="/resume" prefetch="intent">
					Resume
				</FunHoverLink>
			</div>
		</div>
	);
}
