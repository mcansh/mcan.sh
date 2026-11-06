import * as s from "remix/data-schema"
import * as c from "remix/data-schema/checks"

function createEnvSchema(mode: string) {
  let reportUrl = s
    .string()
    .pipe(c.url())
    .refine((value) => {
      let url = new URL(value)
      return (
        ["http:", "https:"].includes(url.protocol) && !url.username && !url.password && !url.hash
      )
    }, "Expected an HTTP(S) reporting URL without credentials or fragment")
    .transform((value) => new URL(value).href)
  return s.object({
    PUBLIC_ORIGIN: s.optional(
      s
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
        }, "Expected an HTTP(S) origin without credentials, path, query, or fragment"),
    ),
    CLOUDINARY_CLOUD_NAME: s.string().pipe(c.minLength(1)),
    SENTRY_DSN: s.optional(
      s
        .string()
        .pipe(c.url())
        .refine((value) => {
          let url = new URL(value)
          return (
            ["http:", "https:"].includes(url.protocol) &&
            Boolean(url.username) &&
            !url.password &&
            /\/\d+$/.test(url.pathname) &&
            !url.search &&
            !url.hash
          )
        }, "Expected an HTTP(S) Sentry DSN with a public key and numeric project ID"),
    ),
    SENTRY_REPORT_URL: mode === "production" ? reportUrl : s.optional(reportUrl),
  })
}

export const DEFAULT_PUBLIC_ORIGIN = "https://www.mcan.sh"

export function parseEnv(
  input: Record<string, string | undefined>,
  mode = process.env.NODE_ENV || "development",
) {
  let sentryDsn = input.SENTRY_DSN || undefined
  let reportUrl = input.SENTRY_REPORT_URL || undefined
  if (!reportUrl && sentryDsn) {
    let url = new URL(sentryDsn)
    let publicKey = decodeURIComponent(url.username)
    url.username = ""
    url.password = ""
    url.pathname = url.pathname.replace(/\/(\d+)$/, "/api/$1/security/")
    url.search = new URLSearchParams({ sentry_key: publicKey }).toString()
    reportUrl = url.href
  }
  let parsed = s.parse(createEnvSchema(mode), {
    ...input,
    PUBLIC_ORIGIN:
      input.PUBLIC_ORIGIN || (mode === "production" ? DEFAULT_PUBLIC_ORIGIN : undefined),
    SENTRY_REPORT_URL: reportUrl,
    SENTRY_DSN: sentryDsn,
  })
  return { ...parsed, mode }
}

export type AppConfig = Readonly<ReturnType<typeof parseEnv>>

export const env = parseEnv(process.env)
