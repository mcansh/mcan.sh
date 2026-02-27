import * as s from "remix/data-schema"
import { minLength, url } from "remix/data-schema/checks"

let envSchema = s.object({
	CLOUDINARY_CLOUD_NAME: s.string().pipe(minLength(1)),
	SENTRY_REPORT_URL: s.string().pipe(url()),
	FATHOM_SITE_ID: s.string().pipe(minLength(1)),
	SENTRY_DSN: s.string().pipe(url()),
})

function parseEnv(input: Record<string, string | undefined>) {
	let env = s.parseSafe(envSchema, input)
	if (env.success) return env.value
	throw env.issues
}

const parsedEnv = parseEnv(process.env)

export const env = {
	...parsedEnv,
	CLOUDINARY_URL: `https://res.cloudinary.com/${parsedEnv.CLOUDINARY_CLOUD_NAME}/image/upload/`,
}
