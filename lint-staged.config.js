import micromatch from "micromatch";

/** @type {import('lint-staged').ConfigFn} */
export default (allStagedFiles) => {
	let commands = ["format"];

	let filesNeedingLintAndTypecheck = micromatch(
		allStagedFiles,
		"**/*.?(c|m)(ts|js)?(x)",
	);

	if (filesNeedingLintAndTypecheck.length > 0) {
		commands.push("typecheck", "lint");
	}

	return commands.map((command) => `npm run ${command} --`);
};
