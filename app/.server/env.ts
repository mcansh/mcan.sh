import { z } from "zod";

export let envSchema = z.object({
	CLOUDINARY_CLOUD_NAME: z.string().min(1),
	SENTRY_REPORT_URL: z.string().url(),
	VITE_FATHOM_SITE_ID: z.string().min(1),
});

export type AppEnv = z.infer<typeof envSchema>;
