import { execSync } from "node:child_process";
import process from "node:process";

let isCi = process.env.CI !== undefined;

/** @type {import('node:child_process').ExecSyncOptionsWithBufferEncoding} */
let options = { stdio: "inherit" };

if (!isCi) {
	let husky = await import("husky").then((m) => m.default);
	husky();
	// format pnpm-lock.yaml
	execSync(`pnpm run format ./pnpm-lock.yaml`, options);
}
