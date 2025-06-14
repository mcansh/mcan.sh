import { envSchema } from "#app/lib.server/env.js";
import { createRequestHandler, unstable_createContext } from "react-router";
import type { z } from "zod/v4-mini";

export const adapterContext = unstable_createContext<
	Env & z.infer<typeof envSchema>
>();

let requestHandler = createRequestHandler(
	// @ts-expect-error - virtual module
	() => import("virtual:react-router/server-build"),
	import.meta.env.MODE,
);

export default {
	fetch(request: Request, env: Env) {
		try {
			let validatedEnv = envSchema.parse(env);
			let context = new Map([[adapterContext, validatedEnv]]);
			return requestHandler(request, context);
		} catch (error) {
			console.error(error);
			return new Response("Internal Server Error", {
				status: 500,
				statusText: "Internal Server Error",
			});
		}
	},
} satisfies ExportedHandler<Env>;
