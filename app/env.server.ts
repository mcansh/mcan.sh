import { z } from "zod";

let envSchema = z.object({
	VITE_CLOUDINARY_CLOUD_NAME: z.string().optional(),
	VITE_SENTRY_REPORT_URL: z.string().optional(),
});

let _env = envSchema.parse(import.meta.env);

// create type for env variables without VITE_ prefix
export type EnvKeys = keyof typeof _env;

type Env<T> = T extends `VITE_${infer P}` ? P : never;

// remove VITE_ prefix
export let env = Object.fromEntries(
	Object.entries(_env).map(([key, value]) => [
		key.replace(/^VITE_/, ""),
		value,
	]),
) as unknown as Record<Env<EnvKeys>, string>;
