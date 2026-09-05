import { css } from "remix/ui"

/**
 * Trims the leading/trailing line-box whitespace so text aligns to its cap and
 * alphabetic edges. Spread into a `css({...})` object's nested rules:
 *
 *   css({ ...someStyles, ...textBoxTrim })
 */
export const textBoxTrim = {
  "@supports (text-box-trim: trim-both)": {
    textBoxTrim: "trim-both",
    textBoxEdge: "cap alphabetic",
  },
} as const

export const visuallyHiddenStyle = css({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: "1px",
  margin: 0,
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  width: "1px",
})

export function spaceX(size: string | number) {
  return css({
    "& > :not(:last-child)": {
      "--tw-space-x-reverse": 0,
      "--spacing": size,
      marginInlineStart: `calc(calc(var(--spacing)) * var(--tw-space-x-reverse))`,
      marginInlineEnd: `calc(calc(var(--spacing)) * calc(1 - var(--tw-space-x-reverse)))`,
    },
  })
}

export function spaceY(size: string | number) {
  return css({
    "& > :not(:last-child)": {
      "--tw-space-x-reverse": 0,
      "--spacing": size,
      marginBlockStart: `calc(calc(var(--spacing)) * var(--tw-space-x-reverse))`,
      marginBlockEnd: `calc(calc(var(--spacing)) * calc(1 - var(--tw-space-x-reverse)))`,
    },
  })
}
