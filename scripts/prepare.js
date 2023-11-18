import { execSync } from "node:child_process";

let isCi = process.env.CI !== undefined;

if (!isCi) {
	let husky = await import("husky");
	husky.install();
	console.log(`installed husky hooks`);
}

console.log(`patching packages`);
execSync("bunx patch-package", { stdio: "inherit" });
