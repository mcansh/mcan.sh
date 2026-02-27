import appStylesHref from "#app/assets/app.css?url"
import fontStyleHref from "#app/assets/berkeley-mono.css?url"
import fontFileHref from "#app/assets/fonts/berkeley-mono-variable-regular.woff2?url"
import clientAssets from "#app/entry.browser.ts?assets=client"
import serverAssets from "#app/entry.server.ts?assets=ssr"
import { mergeAssets } from "@jacob-ebey/vite-plugin-remix/runtime"
import type * as Remix from "remix/component"

export function Document() {
	const assets = mergeAssets(clientAssets, serverAssets)

	return ({
		children,
		nonce,
		bodyClassName,
	}: {
		children: Remix.RemixNode
		nonce: string
		bodyClassName?: string
	}) => (
		<html lang="en" class="h-dvh">
			<head>
				<meta charSet="utf-8" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta
					name="apple-mobile-web-app-status-bar-style"
					content="black-translucent"
				/>
				<meta name="apple-mobile-web-app-title" content="Logan McAnsh" />
				<meta name="application-name" content="Logan McAnsh" />
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width, viewport-fit=cover"
				/>
				<meta
					name="theme-color"
					content="#ffffff"
					media="(prefers-color-scheme: light)"
				/>
				<meta
					name="theme-color"
					content="#0f172a"
					media="(prefers-color-scheme: dark)"
				/>
				<link rel="stylesheet" href={appStylesHref} nonce={nonce} />
				<link rel="stylesheet" href={fontStyleHref} nonce={nonce} />
				<link
					rel="preload"
					href={fontFileHref}
					as="font"
					type="font/woff2"
					crossOrigin="anonymous"
					nonce={nonce}
				/>
				{assets.css.map((attrs) => (
					<link key={attrs.href} {...attrs} rel="stylesheet" nonce={nonce} />
				))}
				{assets.js.map((attrs) => (
					<link key={attrs.href} {...attrs} rel="modulepreload" nonce={nonce} />
				))}
				<script async type="module" src={clientAssets.entry} nonce={nonce} />
				{/*<script src="https://cdn.usefathom.com/script.js" data-site="LHPWDAMW" defer />*/}
			</head>
			<body class={bodyClassName}>{children}</body>
		</html>
	)
}
