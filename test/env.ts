import type { TestContext } from "node:test"

type EnvTestContext = Pick<TestContext, "after">

const originalEnvironments = new WeakMap<EnvTestContext, NodeJS.ProcessEnv>()

export function unstubAllEnv(context: EnvTestContext): void {
  let original = originalEnvironments.get(context)
  if (original === undefined) return
  process.env = original
  originalEnvironments.delete(context)
}

export function stubEnv(context: EnvTestContext, name: string, value: string | undefined): void {
  if (!originalEnvironments.has(context)) {
    originalEnvironments.set(context, process.env)
    process.env = { ...process.env }
    context.after(() => unstubAllEnv(context))
  }
  if (value === undefined) delete process.env[name]
  else process.env[name] = value
}
