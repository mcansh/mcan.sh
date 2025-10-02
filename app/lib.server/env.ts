import { client_env_schema } from "#app/lib.client/schema.js";
import * as z from "zod/mini";

export let envSchema = z.extend(client_env_schema, {
	CLOUDINARY_CLOUD_NAME: z.string().check(z.minLength(1)),
	SENTRY_REPORT_URL: z.string().check(z.url()),
});
