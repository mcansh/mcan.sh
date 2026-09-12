import * as s from "remix/data-schema"
import * as c from "remix/data-schema/checks"

const envSchema = s.object({
  CLOUDINARY_CLOUD_NAME: s.string().pipe(c.minLength(1)),
  SENTRY_REPORT_URL: s.optional(s.string().pipe(c.url())),
})

export function parseEnv(input: Record<string, string | undefined>) {
  return s.parse(envSchema, {
    ...input,
    SENTRY_REPORT_URL: input.SENTRY_REPORT_URL || undefined,
  })
}

export const env = parseEnv(process.env)
