import fsp from "node:fs/promises";
import path from "node:path";

import { glob } from "glob";
import precinct from "precinct";
import { simpleGit } from "simple-git";

let diff = await simpleGit().diffSummary();
let changedFiles = diff.files
	.filter((file) => file.file.startsWith("app"))
	.map((file) => file.file.replace(path.extname(file.file), ""));

let files = await glob("app/**/*", { nodir: true });
// let routeFiles = await glob("app/routes/**/*", { nodir: true });

let routeManifest = Object.values({});

let urls = new Set();

for (let file of files) {
	let content = await fsp.readFile(file, "utf8");
	let type = file.endsWith(".tsx") ? "tsx" : file.endsWith(".ts") ? "ts" : "js";
	let dependencies = precinct(content, { type })
		.filter((dependency) => {
			return (
				dependency.startsWith("./") ||
				dependency.startsWith("../") ||
				dependency.startsWith("~/")
			);
		})
		.map((dependency) => {
			// if the dependency starts with ~, replace with absolute path
			if (dependency.startsWith("~/")) {
				return dependency.replace("~/", "app");
			}
			return dependency;
		});

	if (dependencies.some((dependency) => changedFiles.includes(dependency))) {
		let fileWithoutApp = file.replace("app/", "");
		let route = routeManifest.find((route) => route.file === fileWithoutApp);
		if (route) urls.add(route.path ?? "/");
	}
}

let urlsToPurge = Array.from(urls).map((url) => {
	return new URL(url, "https://www.mcan.sh").toString();
});

console.log("URLS TO PURGE", urlsToPurge.join(", "));
