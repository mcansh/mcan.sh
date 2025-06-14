import { z } from "zod";

export let envSchema = z.object({
	CLOUDINARY_CLOUD_NAME: z.string().min(1),
	SENTRY_REPORT_URL: z.string().url(),
	RAILWAY_GIT_BRANCH: z.string().min(1),
	RAILWAY_DEPLOYMENT_ID: z.string().min(1),
	VITE_FATHOM_SITE_ID: z.string().min(1),
	VITE_SENTRY_DSN: z.string().url(),
});
