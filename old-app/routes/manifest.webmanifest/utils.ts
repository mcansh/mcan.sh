export const linkColor = "#e53a40"

const uniqueIconSizes = new Set([32, 57, 72, 96, 120, 128, 144, 152, 195, 228, 512])

export const iconSizes = [...uniqueIconSizes].map((size) => ({
  src: `/logo-${size}.png`,
  sizes: `${size}x${size}`,
}))
