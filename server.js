import path from "node:path";
import url from "node:url";

import { fastifyStatic } from "@fastify/static";
import { createRequestHandler } from "@mcansh/remix-fastify";
import { installGlobals } from "@remix-run/node";
import { fastify } from "fastify";

installGlobals();

let vite =
	process.env.NODE_ENV === "production"
		? undefined
		: await import("vite").then(({ createServer }) => createServer());

let app = fastify();

let __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// handle asset requests
if (vite) {
	let middie = await import("@fastify/middie").then((m) => m.default);
	await app.register(middie);
	await app.use(vite.middlewares);
} else {
	let client = path.join(__dirname, "build", "client");
	await app.register(fastifyStatic, {
		root: path.join(client, "assets"),
		prefix: "/assets",
		wildcard: true,
		decorateReply: false,
		cacheControl: true,
		dotfiles: "allow",
		etag: true,
		maxAge: "1y",
		immutable: true,
		serveDotFiles: true,
		lastModified: true,
	});

	await app.register(fastifyStatic, {
		root: client,
		prefix: "/",
		wildcard: false,
		cacheControl: true,
		dotfiles: "allow",
		etag: true,
		maxAge: "1h",
		serveDotFiles: true,
		lastModified: true,
	});
}

let remixHandler = createRequestHandler({
	build: vite
		? () => vite.ssrLoadModule("virtual:remix/server-build")
		: () => import("./build/server/index.js"),
});

app.register(async function (childServer) {
	childServer.removeAllContentTypeParsers();
	// allow all content types
	childServer.addContentTypeParser("*", (_request, payload, done) => {
		done(null, payload);
	});

	// handle SSR requests
	childServer.all("*", remixHandler);
});

let port = Number(process.env.PORT) || 3000;

let address = await app.listen({ port, host: "0.0.0.0" });
console.log(`✅ app ready: ${address}`);
