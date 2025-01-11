import * as Sentry from "@sentry/react";
import * as React from "react";
import { hydrateRoot } from "react-dom/client";
import {
	createRoutesFromChildren,
	matchRoutes,
	useLocation,
	useNavigationType,
} from "react-router";
import { HydratedRouter } from "react-router/dom";

Sentry.init({
	dsn: import.meta.env.VITE_SENTRY_DSN,
	environment: import.meta.env.VITE_RAILWAY_GIT_BRANCH,
	release: import.meta.env.VITE_RAILWAY_DEPLOYMENT_ID,
	integrations: [
		Sentry.reactRouterV7BrowserTracingIntegration({
			useEffect: React.useEffect,
			useLocation,
			useNavigationType,
			createRoutesFromChildren,
			matchRoutes,
		}),
		Sentry.browserTracingIntegration(),
	],
	tracesSampleRate: 1.0,
});

React.startTransition(() => {
	hydrateRoot(
		document,
		<React.StrictMode>
			<HydratedRouter />
		</React.StrictMode>,
	);
});
