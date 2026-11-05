import { DEFAULT_PUBLIC_ORIGIN } from "./env.ts"

export { DEFAULT_PUBLIC_ORIGIN }

export function personUrl(): string {
  return `${DEFAULT_PUBLIC_ORIGIN}/`
}
