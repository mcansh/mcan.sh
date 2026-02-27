import { asyncContext } from "remix/async-context-middleware"
import type { Middleware } from "remix/fetch-router"
import { createRouter } from "remix/fetch-router"
import { logger } from "remix/logger-middleware"
import { routes } from "./routes"

import { securityHeaderMiddleware } from "./middleware/security.ts"
import { homeHandler } from "./routes/home.tsx"
import { manifestHandler } from "./routes/manifest.webmanifest/index.ts"
import { resumeHandler } from "./routes/resume.tsx"
import { sitemapHandler } from "./routes/sitemap.ts"
import { wellKnownProfileHandler } from "./routes/well-known.ts"

let middleware: Array<Middleware> = []

if (import.meta.env.DEV) middleware.push(logger())

middleware.push(asyncContext())
middleware.push(securityHeaderMiddleware())

export let router = createRouter({ middleware })

router.map(routes.home, homeHandler)
router.map(routes.wellKnown, wellKnownProfileHandler)
router.map(routes.manifest, manifestHandler)
router.map(routes.sitemap, sitemapHandler)
router.map(routes.resume, resumeHandler)
