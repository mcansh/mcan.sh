import { envSchema } from "#app/lib.server/env.js";
import {
	createContext,
	createRequestHandler,
	RouterContextProvider,
} from "react-router";
import type * as z from "zod/mini";

export const adapterContext = createContext<Env & z.infer<typeof envSchema>>();

let requestHandler = createRequestHandler(
	// @ts-expect-error - virtual module
	() => import("virtual:react-router/server-build"),
	import.meta.env.MODE,
);

export default {
	fetch(request: Request, env: Env) {
		try {
			let validatedEnv = envSchema.parse(env);
			let context = new RouterContextProvider();
			context.set(adapterContext, { ...env, ...validatedEnv });
			// let context = new RouterContextProvider([[adapterContext, validatedEnv]]);
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
