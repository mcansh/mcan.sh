import * as s from "remix/data-schema"
import * as c from "remix/data-schema/checks"

function createEnvSchema(nodeEnv: string | undefined) {
  let reportUrl = s.string().pipe(c.url())
  return s.object({
    CLOUDINARY_CLOUD_NAME: s.string().pipe(c.minLength(1)),
    SENTRY_REPORT_URL: nodeEnv === "production" ? reportUrl : s.optional(reportUrl),
  })
}

export function parseEnv(
  input: Record<string, string | undefined>,
  nodeEnv = process.env.NODE_ENV,
) {
  return s.parse(createEnvSchema(nodeEnv), {
    ...input,
    SENTRY_REPORT_URL: input.SENTRY_REPORT_URL || undefined,
  })
}

export const env = parseEnv(process.env)
