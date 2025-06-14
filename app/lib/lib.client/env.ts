import { z } from "zod/v4-mini";

export let client_env_schema = z.object({
	VITE_FATHOM_SITE_ID: z.string().check(z.minLength(1)),
	VITE_SENTRY_DSN: z.string().check(z.url()),
});

export let client_env = client_env_schema.parse({
	VITE_FATHOM_SITE_ID: import.meta.env.VITE_FATHOM_SITE_ID,
	VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
});
