import * as s from "remix/data-schema"
import * as c from "remix/data-schema/checks"

function createEnvSchema(_nodeEnv: string | undefined) {
  return s.object({
    CLOUDINARY_CLOUD_NAME: s.string().pipe(c.minLength(1)),
    SENTRY_REPORT_URL: s.string().pipe(c.url()),
    SENTRY_DSN: s.string().pipe(c.url()),
  })
}

export function parseEnv(
  input: Record<string, string | undefined>,
  nodeEnv = process.env.NODE_ENV,
) {
  return s.parse(createEnvSchema(nodeEnv), input)
}

export const env = parseEnv(process.env)
