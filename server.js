import console from "node:console";
import process from "node:process";

import { reactRouterFastify } from "@mcansh/remix-fastify/react-router";
import { ip as ipAddress } from "address";
import { fastify } from "fastify";
import getPort, { portNumbers } from "get-port";

let app = fastify();

app.register(reactRouterFastify, { mode: process.env.NODE_ENV });

let host = process.env.HOST || "localhost";
let desiredPort = Number(process.env.PORT) || 5173;

let port = await getPort({ port: portNumbers(desiredPort, desiredPort + 100) });

if (port !== desiredPort) {
	console.log(
		`Desired port ${desiredPort} is not available, using ${port} instead`,
	);
}

await app.listen({ host, port });

/** @type string | null */
let lanUrl = null;
const localIp = ipAddress() ?? "Unknown";
// Check if the address is a private ip
// https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
// https://github.com/facebook/create-react-app/blob/d960b9e38c062584ff6cfb1a70e1512509a966e7/packages/react-dev-utils/WebpackDevServerUtils.js#LL48C9-L54C10
if (/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(localIp)) {
	lanUrl = `http://${localIp}:${port}`;
}

let messages = [
	`✅ app ready!`,
	`📦 mode: ${process.env.NODE_ENV}`,
	`💻 local: http://localhost:${port}`,
	`🏡 network: ${lanUrl}`,
];

console.log(messages.join("\n"));
