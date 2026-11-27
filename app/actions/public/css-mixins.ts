import { css } from "remix/component"

export function spaceY(size: string | number) {
  return css({
    "& > :not(:last-child)": {
      marginBlockEnd: size,
    },
  })
}
