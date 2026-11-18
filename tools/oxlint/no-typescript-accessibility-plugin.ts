import { definePlugin, defineRule } from "@oxlint/plugins"
import type { Context, ESTree } from "@oxlint/plugins"

function isRestrictedConstructor(node: ESTree.MethodDefinition): boolean {
  return (
    node.kind === "constructor" &&
    (node.accessibility === "private" || node.accessibility === "protected")
  )
}

const noTypescriptAccessibilityRule = defineRule({
  meta: {
    type: "problem",
  },
  create(context: Context) {
    return {
      PropertyDefinition(node: ESTree.PropertyDefinition) {
        if (node.accessibility == null) return

        context.report({
          node,
          message: "Use native class fields: omit 'public' and use '#private' for private state.",
        })
      },
      MethodDefinition(node: ESTree.MethodDefinition) {
        if (node.accessibility == null || isRestrictedConstructor(node)) return

        if (node.kind !== "constructor") {
          context.report({
            node,
            message:
              "Use native methods: omit 'public'; for private behavior use '#private' fields/methods.",
          })
          return
        }

        context.report({
          node,
          message: "Omit 'public' on constructors; it's the default.",
        })
      },
      TSParameterProperty(node: ESTree.TSParameterProperty) {
        if (node.accessibility == null) return

        context.report({
          node,
          message:
            "Avoid TS parameter properties; declare fields explicitly and use '#private' when needed.",
        })
      },
    }
  },
})

export default definePlugin({
  meta: {
    name: "remix-typescript",
  },
  rules: {
    "no-typescript-accessibility": noTypescriptAccessibilityRule,
  },
})
