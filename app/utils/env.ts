import * as s from "remix/data-schema"
import * as c from "remix/data-schema/checks"

function createEnvSchema(nodeEnv: string | undefined) {
  let reportUrl = s.string().pipe(c.url())
  let minLengthString = s.string().pipe(c.minLength(1))
  let publicOrigin = s
    .string()
    .pipe(c.url())
    .refine((value) => {
      let url = new URL(value)
      return (
        ["http:", "https:"].includes(url.protocol) &&
        url.pathname === "/" &&
        !url.search &&
        !url.hash &&
        !url.username &&
        !url.password
      )
    }, "Expected an HTTP(S) origin without credentials, path, query, or fragment")

  return s.object({
    PUBLIC_ORIGIN: nodeEnv === "production" ? publicOrigin : s.optional(publicOrigin),
    CLOUDINARY_CLOUD_NAME: s.string().pipe(c.minLength(1)),
    SENTRY_REPORT_URL: nodeEnv === "production" ? reportUrl : s.optional(reportUrl),
    CLOUDFLARE_ACCOUNT_ID: nodeEnv === "production" ? minLengthString : s.optional(minLengthString),
    CLOUDFLARE_API_TOKEN: nodeEnv === "production" ? minLengthString : s.optional(minLengthString),
  })
}

export function parseEnv(
  input: Record<string, string | undefined>,
  nodeEnv = process.env.NODE_ENV,
) {
  return s.parse(createEnvSchema(nodeEnv), {
    ...input,
    PUBLIC_ORIGIN: input.PUBLIC_ORIGIN || undefined,
    SENTRY_REPORT_URL: input.SENTRY_REPORT_URL || undefined,
    CLOUDFLARE_ACCOUNT_ID: input.CLOUDFLARE_ACCOUNT_ID || undefined,
    CLOUDFLARE_API_TOKEN: input.CLOUDFLARE_API_TOKEN || undefined,
  })
}

export const env = parseEnv(process.env)
