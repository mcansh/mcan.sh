let fastify = require("fastify");
let { remixFastifyPlugin } = require("@mcansh/remix-fastify");
let { broadcastDevReady } = require("@remix-run/node");

let serverBuild = require("./build/index.js");

let MODE = process.env.NODE_ENV;

async function start() {
  let app = fastify();

  await app.register(remixFastifyPlugin, {
    build: serverBuild,
    mode: MODE,
    purgeRequireCacheInDevelopment: false,
    unstable_earlyHints: true,
  });

  let port = Number(process.env.PORT) || 3000;

  let address = await app.listen({ port, host: "0.0.0.0" });
  if (MODE === "development") {
    broadcastDevReady(serverBuild);
  }
  console.log(`✅ app ready: ${address}`);
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
