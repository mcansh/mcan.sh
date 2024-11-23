import cp from "node:child_process";
import { parseArgs } from "node:util";

const result = parseArgs({
	args: process.argv.slice(2),
	allowPositionals: true,
});

let [command, ...rest] = result.positionals;

/**
 * @param {string} command
 * @param {string} [args]
 * @returns {void}
 */
function runScript(command, args = []) {
	console.log(`> ${command} ${args.join(" ")}`);
	cp.spawnSync(command, args, { stdio: "inherit" });
}

switch (command) {
	case "typecheck": {
		runScript("react-router typegen");
		runScript("tsc");
		break;
	}

	case "lint": {
		if (!rest.length) {
			console.log("no files specified, linting all files.");
			rest = ["."];
		}
		let args = [
			"--ignore-path",
			".gitignore",
			"--fix",
			"--no-error-on-unmatched-pattern",
			"--cache",
			"--cache-location",
			"./node_modules/.cache/eslint",
			...rest,
		];
		runScript("eslint", args);
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
		runScript("prettier", args);
		break;
	}

	default: {
		throw new Error(
			`Unknown script ${command}, expected \`lint\`, \`format\`, or \`typecheck\``,
		);
	}
}
