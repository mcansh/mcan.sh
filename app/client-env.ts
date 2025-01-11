import { z } from "zod";

export let client_env_schema = z.object({
	VITE_FATHOM_SITE_ID: z.string().min(1),
	VITE_SENTRY_DSN: z.string().url(),
	RAILWAY_GIT_BRANCH: z.string().min(1),
	RAILWAY_DEPLOYMENT_ID: z.string().min(1),
});

export let client_env = client_env_schema.parse({
	VITE_FATHOM_SITE_ID: import.meta.env.VITE_FATHOM_SITE_ID,
	VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
	RAILWAY_GIT_BRANCH: import.meta.env.RAILWAY_GIT_BRANCH,
	RAILWAY_DEPLOYMENT_ID: import.meta.env.RAILWAY_DEPLOYMENT_ID,
});

console.log({ client_env });
