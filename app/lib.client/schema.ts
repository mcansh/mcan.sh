import * as z from "zod/mini";

export let client_env_schema = z.object({
	VITE_FATHOM_SITE_ID: z.string().check(z.minLength(1)),
	VITE_SENTRY_DSN: z.string().check(z.url()),
});
