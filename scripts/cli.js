#!/usr/bin/env zx

import console from "node:console";
import process from "node:process";
import { parseArgs } from "node:util";
import { $ } from "zx";

let result = parseArgs({
	args: process.argv.slice(2),
	allowPositionals: true,
});

/**
 * @param {string} command
 * @param {string} [args]
 * @returns {Promise<void>}
 */
async function runScript(command, args = []) {
	console.log(`> ${command} ${args.join(" ")}`);
	return $({ stdio: "inherit" })`npx ${command} ${args}`;
}

async function run() {
	let [command, ...rest] = result.positionals;

	switch (command) {
		case "typecheck": {
			await runScript("node", ["--run", "cf-typegen"]);
			await runScript("react-router", ["typegen"]);
			await runScript("tsgo");
			return;
		}

		case "lint": {
			if (!rest.length) {
				console.log("no files specified, linting all files.");
				rest = ["."];
			}

			let args = [
				"--fix",
				"--no-error-on-unmatched-pattern",
				"--cache",
				"--cache-location",
				"./node_modules/.cache/eslint",
				...rest,
			];

			await runScript("eslint", args);
			return;
		}

		case "format": {
			if (!rest.length) {
				console.log("no files specified, formatting all files.");
				rest = ["."];
			}

			let args = [
				"--ignore-path",
				".gitignore",
				"--ignore-path",
				".prettierignore",
				"--cache",
				"--ignore-unknown",
				"--write",
				...rest,
			];

			await runScript("prettier", args);
			return;
		}

		case "validate": {
			await Promise.all([
				runScript("node", ["--run", "typecheck"]),
				runScript("node", ["--run", "lint"]),
				runScript("node", ["--run", "format"]),
			]);
			return;
		}

		default: {
			throw new Error(
				`Unknown script ${command}, expected \`lint\`, \`format\`, \`typecheck\`, or \`validate\`.`,
			);
		}
	}
}

run().then(
	() => {
		process.exit(0);
	},
	(error) => {
		if (error) console.error(error);
		process.exit(1);
	},
);
