import type { Middleware } from "remix/router"
import { createContextKey } from "remix/router"

import type { AppConfig } from "../utils/env.ts"

const configKey = createContextKey<AppConfig>()

export function appConfig(config: AppConfig): Middleware<{
  key: typeof configKey
  value: AppConfig
  property: "config"
}> {
  return (context, next) => {
    context.set(configKey, config, { property: "config" })
    return next()
  }
}
