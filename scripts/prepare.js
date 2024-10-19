import { execSync } from "node:child_process";

let isCi = process.env.CI !== undefined;

if (!isCi) {
	let husky = await import("husky").then((m) => m.default);
	husky();
	// format pnpm-lock.yaml
	execSync(`pnpm run format ./pnpm-lock.yaml`, { stdio: "inherit" });
}
