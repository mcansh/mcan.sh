import { execSync } from "node:child_process";

const isCi = process.env.CI !== undefined;

if (!isCi) {
	let husky = await import("husky").then((m) => m.default);
	husky();
}

console.log("patching packages");
execSync("pnpm dlx patch-package", { stdio: "inherit" });
