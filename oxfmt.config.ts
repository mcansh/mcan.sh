import { defineConfig } from "oxfmt"

import { IGNORE_PATTERNS } from "./oxlint.config.ts"

export default defineConfig({
  ignorePatterns: IGNORE_PATTERNS,
  sortImports: true,
  sortPackageJson: true,
  semi: false,
})
