import { definePlugin, defineRule } from "@oxlint/plugins"
import type { Context, ESTree } from "@oxlint/plugins"

const pascalCasePattern = /^[A-Z][A-Za-z0-9]*$/

const interfacePascalCaseRule = defineRule({
  meta: {
    type: "suggestion",
  },
  create(context: Context) {
    return {
      TSInterfaceDeclaration(node: ESTree.TSInterfaceDeclaration) {
        if (pascalCasePattern.test(node.id.name)) return

        context.report({
          node: node.id,
          message: "Interface names must use PascalCase.",
        })
      },
    }
  },
})

export default definePlugin({
  meta: {
    name: "remix-interface",
  },
  rules: {
    "interface-pascal-case": interfacePascalCaseRule,
  },
})
