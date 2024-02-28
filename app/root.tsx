import { useNonce } from "@mcansh/http-helmet/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useMatches,
	useRouteError,
} from "@remix-run/react";
import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import * as Fathom from "fathom-client";
import * as React from "react";
import { twMerge } from "tailwind-merge";
import tailwindStyleHref from "tailwindcss/tailwind.css?url";

import fontStyleHref from "~/assets/berkeley-mono.css?url";
import type { Match } from "~/types/handle";

export const meta: MetaFunction = () => {
	return [
		{ title: "Logan McAnsh" },
		{ name: "description", content: "personal website for logan mcansh" },
	];
};

export const links: LinksFunction = () => {
	let icons = [32, 57, 72, 96, 120, 128, 144, 152, 195, 228].map((icon) => {
		return {
			href: `/logo-${icon}.png`,
			sizes: `${icon}x${icon}`,
			rel: "apple-touch-icon",
		};
	});

	return [
		{ rel: "manifest", href: "/manifest.webmanifest" },
		{ rel: "icon", href: "/favicon.png", type: "image/png" },
		{ rel: "icon", href: "/favicon.ico" },
		{ rel: "stylesheet", href: tailwindStyleHref },
		{ rel: "stylesheet", href: fontStyleHref },
		{ rel: "preload", href: tailwindStyleHref, as: "style" },
		{ rel: "preload", href: fontStyleHref, as: "style" },
		...icons,
	];
};

function useFathom() {
	let initialized = React.useRef(false);
	React.useEffect(() => {
		if (initialized.current) return;
		initialized.current = true;
		Fathom.load("EPVCGNZL", {
			excludedDomains: ["localhost"],
			url: "https://thirtyseven-active.b-cdn.net/script.js",
			spa: "auto",
		});
	}, []);
}

function useHandleBodyClassName() {
	let matches = useMatches() as unknown as Array<Match>;

	return matches.reduce<Array<string>>((acc, match) => {
		if (!match.handle) return acc;
		if (!match.handle.bodyClassName) return acc;
		if (typeof match.handle.bodyClassName !== "string") return acc;
		return [...acc, match.handle.bodyClassName];
	}, []);
}

export function Layout({ children }: { children: React.ReactNode }) {
	let error = useRouteError();
	let handleBodyClassName = useHandleBodyClassName();
	let nonce = useNonce();
	useFathom();

	return (
		<html lang="en" className="h-full">
			<head>
				<DefaultMeta />
				<Meta />
				<Links />
			</head>
			<body
				className={cn(
					error
						? "mx-auto flex min-h-screen w-[90%] max-w-5xl flex-col justify-center space-y-4 bg-blue-screen pt-20 text-center text-white"
						: "h-full font-thin dark:bg-slate-900 dark:text-white",
					handleBodyClassName,
				)}
			>
				{children}
				<ScrollRestoration nonce={nonce} />
				<Scripts nonce={nonce} />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

const canUseDOM = !!(
	typeof window !== "undefined" &&
	window.document &&
	window.document.createElement
);

export function ErrorBoundary() {
	let error = useRouteError();
	if (!canUseDOM) console.error(error);

	let headingClassName = `w-fit mx-auto inline-block text-3xl font-bold bg-white text-blue-screen`;
	let boxClassName = `w-full px-4 py-2 overflow-auto border-4 border-white`;

	return isRouteErrorResponse(error) ? (
		<div className="space-y-4">
			<h1 className={headingClassName}>
				{error.status} {error.statusText}
			</h1>
		</div>
	) : error instanceof Error ? (
		<div className="space-y-4">
			<h1 className={headingClassName}>Uncaught Exception!</h1>
			<p>
				If you are not the developer, please click back in your browser and try
				again.
			</p>

			<details className="space-y-4">
				<summary className="cursor-pointer">Error message</summary>
				<pre className={boxClassName}>{error.message}</pre>

				{process.env.NODE_ENV === "production" ? (
					<p>
						There was an uncaught exception in your application. Check the
						browser console and/or the server console to inspect the error.
					</p>
				) : (
					<pre className={cn(boxClassName, "text-left")}>{error.stack}</pre>
				)}
			</details>
		</div>
	) : (
		<>
			<h1 className={headingClassName}>Unknown Error!</h1>
			<p>
				If you are not the developer, please click back in your browser and try
				again.
			</p>
			<pre className={boxClassName}>{String(error)}</pre>
		</>
	);
}

function DefaultMeta() {
	return (
		<>
			<meta charSet="utf-8" />
			<meta
				name="viewport"
				content="initial-scale=1.0, width=device-width, viewport-fit=cover"
			/>
			<meta
				name="apple-mobile-web-app-status-bar-style"
				content="black-translucent"
			/>
			<meta name="apple-mobile-web-app-capable" content="yes" />
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
		</>
	);
}

function cn(...inputs: Array<ClassValue>) {
	return twMerge(clsx(...inputs));
}
