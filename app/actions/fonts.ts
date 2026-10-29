/**
 * Google Fonts used by the Remix 3 app.
 *
 * Weight audit of `app/` component styles, including inline `fontWeight` and
 * resume `<strong>` (bolder → 700 when the parent is 400):
 *   400 — body copy and unselected picker chips
 *   500 — titles, labels, and the active font name
 *   700 — selected chips, resume headings, and `<strong>`
 * No `font-style: italic` / `ital` in `app/`.
 *
 * Modern Google Fonts CSS for exact `400;500;700` and the variable range
 * `400..700` points latin text at the same woff2. The range stylesheet is
 * smaller, so body text uses the range. Picker previews only need 400.
 */
export const FONT_CONFIGS = [
  ["Inter (Default)", "Inter"],
  ["Geist", "Geist"],
  ["Instrument Sans", "Instrument Sans"],
  ["DM Sans", "DM Sans"],
  ["Space Grotesk", "Space Grotesk"],
] as const satisfies readonly [displayName: string, family: string][]

export const FONT_OPTIONS = FONT_CONFIGS.length

export const BODY_FONT_WEIGHTS = "400..700"
export const PICKER_PREVIEW_WEIGHTS = "400"
export const FONT_DISPLAY = "swap"

const GOOGLE_FONTS_CSS = "https://fonts.googleapis.com/css2"
const DEFAULT_FONT_CONFIG = FONT_CONFIGS[0]

export function fontConfigAt(index: number): (typeof FONT_CONFIGS)[number] {
  return FONT_CONFIGS[index] ?? DEFAULT_FONT_CONFIG
}

export function googleFontsStylesheetUrl(
  families: readonly string[],
  weights: string,
  text?: string,
): string {
  let familyQuery = families
    .map((family) => `family=${family.replaceAll(" ", "+")}:wght@${weights}`)
    .join("&")
  let url = `${GOOGLE_FONTS_CSS}?${familyQuery}&display=${FONT_DISPLAY}`
  if (text !== undefined && text !== "") url += `&text=${encodeURIComponent(text)}`
  return url
}

export function bodyFontStylesheetUrl(family: string): string {
  return googleFontsStylesheetUrl([family], BODY_FONT_WEIGHTS)
}

export function pickerPreviewText(): string {
  let unique = new Set<string>()
  for (let [displayName] of FONT_CONFIGS) {
    for (let char of displayName) unique.add(char)
  }
  return [...unique].sort().join("")
}

export function pickerPreviewFamilies(activeFamily: string): string[] {
  return FONT_CONFIGS.map(([, family]) => family).filter((family) => family !== activeFamily)
}

export function pickerPreviewStylesheetUrl(activeFamily: string): string {
  let families = pickerPreviewFamilies(activeFamily)
  if (families.length === 0) return ""
  return googleFontsStylesheetUrl(families, PICKER_PREVIEW_WEIGHTS, pickerPreviewText())
}

export function cssFontFamilyValue(family: string): string {
  return `'${family}', var(--font-sans)`
}
