export const FONT_CONFIGS = [
  ["Inter (Default)", "Inter"],
  ["Geist", "Geist"],
  ["Instrument Sans", "Instrument Sans"],
  ["DM Sans", "DM Sans"],
  ["Space Grotesk", "Space Grotesk"],
] as const satisfies readonly [displayName: string, family: string][]

export const FONT_OPTIONS = FONT_CONFIGS.length

const GOOGLE_FONTS_CSS = "https://fonts.googleapis.com/css2"
const DEFAULT_FONT_CONFIG = FONT_CONFIGS[0]
const PICKER_PREVIEW_TEXT = [...new Set(FONT_CONFIGS.map(([name]) => name).join(""))]
  .sort()
  .join("")

export function fontConfigAt(index: number): (typeof FONT_CONFIGS)[number] {
  return FONT_CONFIGS.at(index) ?? DEFAULT_FONT_CONFIG
}

function googleFontsStylesheetUrl(
  families: readonly string[],
  weights: string,
  text?: string,
): string {
  let familyQuery = families
    .map((family) => `family=${family.replaceAll(" ", "+")}:wght@${weights}`)
    .join("&")
  let url = `${GOOGLE_FONTS_CSS}?${familyQuery}&display=swap`
  if (text !== undefined) url += `&text=${encodeURIComponent(text)}`
  return url
}

export function bodyFontStylesheetUrl(family: string): string {
  return googleFontsStylesheetUrl([family], "400..700")
}

export function pickerPreviewStylesheetUrl(activeFamily: string): string {
  let families = FONT_CONFIGS.map(([, family]) => family).filter(
    (family) => family !== activeFamily,
  )
  return googleFontsStylesheetUrl(families, "400", PICKER_PREVIEW_TEXT)
}

export function cssFontFamilyValue(family: string): string {
  return `'${family}', var(--font-sans)`
}
