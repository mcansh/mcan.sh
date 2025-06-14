import { client_env_schema } from "./schema";

export let client_env = client_env_schema.parse({
	VITE_FATHOM_SITE_ID: import.meta.env.VITE_FATHOM_SITE_ID,
	VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
});
