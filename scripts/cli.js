import spawn from "cross-spawn";
import console from "node:console";
import process from "node:process";
import { parseArgs } from "node:util";

const result = parseArgs({
	args: process.argv.slice(2),
	allowPositionals: true,
});

/**
 * @param {string} command
 * @param {string} [args]
 * @returns {void}
 */
async function runScript(command, args = []) {
	console.log(`> ${command} ${args.join(" ")}`);
	return spawn(command, args, { stdio: "inherit" });
}

async function run() {
	let [command, ...rest] = result.positionals;

	switch (command) {
		case "typecheck": {
			await runScript("react-router typegen");
			await runScript("tsc");
			break;
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
			break;
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
			break;
		}

		case "validate": {
			await Promise.all([
				runScript("node", ["--run", "typecheck"]),
				runScript("node", ["--run", "lint"]),
				runScript("node", ["--run", "format"]),
			]);
			break;
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
