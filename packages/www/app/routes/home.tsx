import { FunHoverLink } from "#app/components/fun-link-hover.tsx"
import { getMugshotURL } from "#app/lib/cloudinary.ts"
import { env } from "#app/lib/env.ts"
import { renderDocument } from "#app/lib/render.tsx"
import { routes } from "#app/routes.ts"
import type { BuildAction } from "remix/fetch-router"
import { CacheControl } from "remix/headers"

export const homeHandler = {
	middleware: [],
	action({ url }) {
		let headers = new Headers()
		headers.set(
			"Cache-Control",
			new CacheControl({
				public: true,
				maxAge: 60 * 60,
				staleWhileRevalidate: 60 * 60 * 2,
				sMaxage: 60 * 60,
			}).toString(),
		)
		headers.append("Link", [`<${url.href}>; rel=canonical`].join(", "))

		let me1x = getMugshotURL(env.CLOUDINARY_CLOUD_NAME, {
			resize: { type: "fill", width: 240, height: 240 },
		})
		let me2x = getMugshotURL(env.CLOUDINARY_CLOUD_NAME, {
			resize: { type: "fill", width: 480, height: 480 },
		})
		let me3x = getMugshotURL(env.CLOUDINARY_CLOUD_NAME, {
			resize: { type: "fill", width: 720, height: 720 },
		})

		let srcSet = [`${me1x.href} 1x`, `${me2x.href} 2x`, `${me3x.href} 3x`].join(
			", ",
		)

		return renderDocument(
			<>
				<title>Logan McAnsh</title>
				<meta name="description" content="personal website for Logan McAnsh" />
				<script
					type="application/ld+json"
					innerHTML={JSON.stringify({
						"@context": "https://schema.org",
						"@type": "Person",
						name: "Logan McAnsh",
						url: "https://mcan.sh",
						jobTitle: "Senior Software Engineer",
						image: me2x.href,
						sameAs: [
							"https://github.com/mcansh",
							"https://linkedin.com/in/loganmcansh",
							"https://x.com/loganmcansh",
						],
					})}
				/>
				<main className="mx-auto flex h-full max-w-screen-md flex-col items-center justify-between px-4 text-center">
					<div className="flex flex-1 flex-col items-center justify-center">
						<img
							width={240}
							height={240}
							alt="Logan McAnsh"
							className="mx-auto size-60 rounded-full"
							fetchPriority="high"
							src={me1x.href}
							srcSet={srcSet}
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
						<FunHoverLink href="https://github.com/mcansh">GitHub</FunHoverLink>
						<FunHoverLink href={routes.resume.href()}>Resume</FunHoverLink>
					</div>
				</main>
			</>,
			{
				bodyClassName: "h-full font-thin dark:bg-slate-900 dark:text-white",
			},
		)
	},
} satisfies BuildAction<"GET", typeof routes.home>
