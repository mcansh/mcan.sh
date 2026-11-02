export function getIndex(index: string | null, max: number): number {
  if (index == null) return 0
  let n = Number.parseInt(index, 10)
  if (!Number.isNaN(n) && n >= 1 && n <= max) return n - 1
  return 0
}
