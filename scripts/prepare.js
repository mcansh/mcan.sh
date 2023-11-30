import { execSync } from "node:child_process";

let isCi = process.env.CI !== undefined;

if (!isCi) {
	let husky = await import("husky");
	husky.install();
}

console.log(`patching packages`);
execSync("pnpm dlx patch-package", { stdio: "inherit" });
