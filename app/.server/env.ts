import { client_env_schema } from "#app/client-env.js";
import { z } from "zod";

let envSchema = client_env_schema.extend({
	CLOUDINARY_CLOUD_NAME: z.string().min(1),
	SENTRY_REPORT_URL: z.string().url(),
	RAILWAY_GIT_BRANCH: z.string().min(1),
	RAILWAY_DEPLOYMENT_ID: z.string().min(1),
});

export let env = envSchema.parse(process.env);
