import { client_env_schema } from "#app/lib/lib.client/env.ts";
import { z } from "zod/v4-mini";

export let envSchema = z.extend(client_env_schema, {
	CLOUDINARY_CLOUD_NAME: z.string().check(z.minLength(1)),
	SENTRY_REPORT_URL: z.string().check(z.url()),
});
