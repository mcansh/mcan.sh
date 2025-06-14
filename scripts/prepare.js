import process from "node:process";

let isCi = process.env.CI !== undefined;

if (!isCi) {
	let husky = await import("husky").then((m) => m.default);
	husky();
}
