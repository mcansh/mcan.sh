import cp from "node:child_process";
import { parseArgs } from "node:util";

const result = parseArgs({
	args: process.argv.slice(2),
	allowPositionals: true,
});

let [command, ...rest] = result.positionals;

let options = { stdio: "inherit" };

switch (command) {
	case "typecheck": {
		cp.execSync("tsc", options);
		break;
	}

	case "lint": {
		if (!rest.length) rest = ["."];
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
		cp.execSync(`eslint ${args.join(" ")}`, options);
		break;
	}

	case "format": {
		if (!rest.length) rest = ["."];
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
		cp.execSync(`prettier ${args.join(" ")}`, options);
		break;
	}

	default: {
		throw new Error(
			`Unknown script ${command}, expected \`lint\`, \`format\`, or \`typecheck\``,
		);
	}
}
