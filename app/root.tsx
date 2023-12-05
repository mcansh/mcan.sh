import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
	isRouteErrorResponse,
	Links,
	LiveReload,
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
import "tailwindcss/tailwind.css";

import "~/assets/berkeley-mono.css";
import { NonceContext } from "~/components/nonce";
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

export default function App() {
	let handleBodyClassName = useHandleBodyClassName();
	let nonce = React.useContext(NonceContext);
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
					"h-full font-thin dark:bg-slate-900 dark:text-white",
					handleBodyClassName,
				)}
			>
				<Outlet />
				<ScrollRestoration nonce={nonce} />
				<Scripts nonce={nonce} />
				<LiveReload nonce={nonce} />
			</body>
		</html>
	);
}

export function ErrorBoundary() {
	let error = useRouteError();
	let nonce = React.useContext(NonceContext);
	console.error(error);
	useFathom();

	let handleBodyClassName = useHandleBodyClassName();
	let headingClassName = `w-fit mx-auto inline-block text-3xl font-bold bg-white text-[#0827f5]`;
	let boxClassName = `w-full px-4 py-2 overflow-auto border-4 border-white`;

	return (
		<html lang="en" className="h-full">
			<head>
				<title>Uh-oh!</title>
				<DefaultMeta />
				<Meta />
				<Links />
			</head>
			<body
				className={cn(
					"mx-auto flex min-h-screen w-[90%] max-w-5xl flex-col justify-center space-y-4 bg-[#0827f5] pt-20 text-center text-white",
					handleBodyClassName,
				)}
			>
				{isRouteErrorResponse(error) ? (
					<>
						<h1 className={headingClassName}>
							{error.status} {error.statusText}
						</h1>
					</>
				) : error instanceof Error ? (
					<>
						<h1 className={headingClassName}>Uncaught Exception!</h1>
						<p>
							If you are not the developer, please click back in your browser
							and try again.
						</p>
						<pre className={boxClassName}>{error.message}</pre>

						{process.env.NODE_ENV === "production" ? (
							<p>
								There was an uncaught exception in your application. Check the
								browser console and/or the server console to inspect the error.
							</p>
						) : (
							<pre className={cn(boxClassName, "text-left")}>{error.stack}</pre>
						)}
					</>
				) : (
					<>
						<h1 className={headingClassName}>Unknown Error!</h1>
						<p>
							If you are not the developer, please click back in your browser
							and try again.
						</p>
						<pre className={boxClassName}>{String(error)}</pre>
					</>
				)}
				<ScrollRestoration nonce={nonce} />
				<LiveReload nonce={nonce} />
				<Scripts nonce={nonce} />
			</body>
		</html>
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
