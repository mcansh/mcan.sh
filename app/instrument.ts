import { env } from "#app/.server/env.js";
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
	dsn: env.SENTRY_REPORT_URL,
	environment: env.RAILWAY_GIT_BRANCH,
	release: env.RAILWAY_DEPLOYMENT_ID,
	integrations: [
		// Add our Profiling integration
		nodeProfilingIntegration(),
	],

	// Add Tracing by setting tracesSampleRate
	// We recommend adjusting this value in production
	tracesSampleRate: 1.0,

	// Set sampling rate for profiling
	// This is relative to tracesSampleRate
	profilesSampleRate: 1.0,
});
