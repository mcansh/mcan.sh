import { remixFastify } from "@mcansh/remix-fastify";
import { installGlobals } from "@remix-run/node";
import { fastify } from "fastify";

installGlobals({ nativeFetch: true });

let app = fastify();

app.register(remixFastify);

let port = Number(process.env.PORT) || 5173;

let address = await app.listen({ port, host: "0.0.0.0" });
console.log(`✅ app ready: ${address}`);
