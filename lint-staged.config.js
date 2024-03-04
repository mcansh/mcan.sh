import micromatch from "micromatch";

let ts_ext = ["ts", "tsx", "cts", "mts"];
let js_ext = ["js", "jsx"];

let ts_glob = ts_ext.map((ext) => `**/*.${ext}`);
let js_glob = js_ext.map((ext) => `**/*.${ext}`);

/** @type {import('lint-staged').ConfigFn} */
export default (allStagedFiles) => {
	let tsFiles = micromatch(allStagedFiles, ts_glob);
	let jsFiles = micromatch(allStagedFiles, js_glob);
	let commands = ["npm run format --"];
	if (tsFiles.length) commands.push("npm run typecheck --");
	if (jsFiles.length) commands.push("npm run lint --");
	return commands;
};
