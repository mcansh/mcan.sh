import { captureException } from "@sentry/cloudflare"
import * as s from "remix/data-schema"

declare const sentryDsnBrand: unique symbol

export type SentryDsn = string & { readonly [sentryDsnBrand]: never }

export type SentryBindings = {
  readonly SENTRY_DSN?: string
}

export type ErrorOnlySentryOptions = {
  dsn: SentryDsn
  tracesSampleRate: 0
  tracesSampler: () => 0
  dataCollection: {
    userInfo: false
    cookies: false
    httpHeaders: false
    httpBodies: []
    urlQueryParams: false
  }
}

export function sentryOptions(env: SentryBindings | undefined): ErrorOnlySentryOptions | undefined {
  let dsn = readDsn(env)
  if (dsn === undefined) return undefined
  return {
    dsn,
    tracesSampleRate: 0,
    tracesSampler: () => 0,
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
      urlQueryParams: false,
    },
  }
}

function readDsn(env: SentryBindings | undefined): SentryDsn | undefined {
  function isSentryDsn(value: string): value is SentryDsn {
    return value.length > 0 && value === value.trim()
  }

  if (env == null) return undefined
  let parsed = s.parseSafe(s.string(), env.SENTRY_DSN)
  if (!parsed.success) return undefined
  let trimmed = parsed.value.trim()
  if (!isSentryDsn(trimmed)) return undefined
  return trimmed
}

export function reportServerError<Thrown>(error: Thrown): void {
  try {
    captureException(error)
  } catch {}
}
