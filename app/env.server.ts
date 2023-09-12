import { z } from "zod";

let envSchema = z.object({
	CLOUDINARY_CLOUD_NAME: z.string(),
	SENTRY_REPORT_URL: z.string(),
});

export let env = envSchema.parse(process.env);
