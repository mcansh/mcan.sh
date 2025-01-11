import * as React from "react";
import { useHydrated } from "remix-utils/use-hydrated";

// TODO: These types should be coming from the toolbar itself, which exports them
interface InitProps extends Record<string, unknown> {
	rootNode?: HTMLElement | (() => HTMLElement);
}
type Cleanup = () => void;
type SentryToolbar = {
	init: (initProps?: InitProps) => Cleanup;
};

interface WindowWithMaybeIntegration extends Window {
	SentryToolbar?: SentryToolbar;
}
function getWindow(): WindowWithMaybeIntegration {
	return window;
}

export async function loadToolbar(
	signal: AbortSignal,
	cdn: string,
): Promise<SentryToolbar> {
	let existing = getWindow().SentryToolbar;
	if (existing) {
		return existing;
	}

	await lazyLoad(signal, cdn);

	let toolbarModule = getWindow().SentryToolbar;
	if (!toolbarModule) {
		throw new Error(`Could not load toolbar bundle from ${cdn}`);
	}

	return toolbarModule;
}

async function lazyLoad(signal: AbortSignal, url: string): Promise<void> {
	let script = document.createElement("script");
	script.src = url;
	script.crossOrigin = "anonymous";
	script.referrerPolicy = "origin";

	let waitForLoad = new Promise<void>((resolve, reject) => {
		script.addEventListener("load", () => {
			if (!signal.aborted) {
				resolve();
			}
		});
		script.addEventListener("error", (error) => {
			if (!signal.aborted) {
				reject(error);
			}
		});
	});

	document.body.appendChild(script);

	try {
		await waitForLoad;
	} catch (error) {
		console.log(error);
		throw new Error(`Error when loading integration: ${url}`);
	}
}

export function useSentryToolbar({
	enabled,
	cdn = "https://browser.sentry-cdn.com/sentry-toolbar/latest/toolbar.min.js",
	initProps,
}: {
	enabled: boolean;
	cdn?: string;
	initProps?: InitProps;
}) {
	React.useEffect(() => {
		if (!enabled) {
			console.log("Sentry toolbar is disabled");
			return;
		}

		let isHydrated = useHydrated();
		if (!isHydrated) {
			console.log("Sentry toolbar is waiting for hydration");
			return;
		}

		let controller = new AbortController();

		let cleanup: VoidFunction | undefined = undefined;
		loadToolbar(controller.signal, cdn).then((SentryToolbar) => {
			cleanup = SentryToolbar.init(initProps);
		});

		return () => {
			controller.abort();
			cleanup?.();
		};
	}, [enabled, cdn]);
}
