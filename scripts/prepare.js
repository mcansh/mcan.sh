import { execSync } from "node:child_process";

let isCi = process.env.CI !== undefined;

if (!isCi) {
	let husky = await import("husky");
	husky.install();
	// format pnpm-lock.yaml
	execSync(`pnpm run format ./pnpm-lock.yaml`, { stdio: "inherit" });
}

console.log(`patching packages`);
execSync("pnpm dlx patch-package", { stdio: "inherit" });
