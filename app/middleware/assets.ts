import * as path from "node:path"

import type { ScriptEntry } from "remix/assets"
import { getContext } from "remix/middleware/async-context"
import type { Middleware, RequestContext } from "remix/router"
import { createContextKey } from "remix/router"

import { assets } from "../assets.ts"

type StylesheetName = "global"

type AssetEntry = {
  scriptEntry: ScriptEntry
  stylesheets: Record<StylesheetName, StylesheetAsset>
}

type StylesheetAsset = {
  href: string
}

const assetEntryKey = createContextKey<AssetEntry>()

const defaultEntry = path.resolve(import.meta.dirname, "../actions/public/entry.ts")

const stylesheetEntries = {
  global: path.resolve(import.meta.dirname, "../actions/public/global.css"),
} as const

export type AssetEntryContextEntry = {
  key: typeof assetEntryKey
  value: AssetEntry
}

export function loadAssetEntry(entry = defaultEntry): Middleware<AssetEntryContextEntry> {
  return async (context, next) => {
    let [scriptEntry, stylesheetHref] = await Promise.all([
      assets.getScriptEntry(entry),
      assets.getHref(stylesheetEntries.global),
    ])

    context.set(assetEntryKey, {
      scriptEntry,
      stylesheets: { global: { href: stylesheetHref } },
    })
    return next()
  }
}

export function getAssetEntry(context: Pick<RequestContext, "get"> = getContext()): AssetEntry {
  let entry = getOptionalAssetEntry(context)
  if (!entry) throw new Error("Asset entry is not loaded")
  return entry
}

export function getOptionalAssetEntry(
  context: Pick<RequestContext, "get"> = getContext(),
): AssetEntry | undefined {
  return context.get(assetEntryKey)
}
