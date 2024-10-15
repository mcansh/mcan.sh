import type { AppLoadContext } from "@remix-run/cloudflare";
import type { PlatformProxy } from "wrangler";

import { envSchema } from "#app/.server/env.js";
import type { Env } from "#app/.server/env.js";

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "@remix-run/cloudflare" {
	interface AppLoadContext {
		cloudflare: Cloudflare;
		env: Env;
	}
}

type GetLoadContext = (args: {
	request: Request;
	context: { cloudflare: Cloudflare }; // load context _before_ augmentation
}) => AppLoadContext;

// Shared implementation compatible with Vite, Wrangler, and Cloudflare Pages
export const getLoadContext: GetLoadContext = ({ context }) => {
	let env = envSchema.parse(context.cloudflare.env);
	return {
		...context,
		env,
	};
};
