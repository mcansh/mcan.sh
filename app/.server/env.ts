import { z } from "zod";

import { client_env_schema } from "#app/client-env.js";

let envSchema = client_env_schema.extend({
	CLOUDINARY_CLOUD_NAME: z.string().min(1),
	SENTRY_REPORT_URL: z.string().url(),
	VITE_FATHOM_SITE_ID: z.string().min(1),
	VITE_SENTRY_DSN: z.string().url(),
	RAILWAY_GIT_BRANCH: z.string().min(1),
	RAILWAY_DEPLOYMENT_ID: z.string().min(1),
});

export let env = envSchema.parse(process.env);
