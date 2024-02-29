import { readConfig } from "@remix-run/dev/dist/config.js";
import { globSync } from "glob";

let remixConfig = await readConfig(process.cwd());

let currentBuild = globSync("./**/*", { cwd: "./current/client" });
let previousBuild = globSync("./**/*", { cwd: "./previous/client" });

let changedFiles = [];

// check if any files were added or removed from the build
// between the current and previous builds
for (let index = 0; index < currentBuild.length; index++) {
	let currentFile = currentBuild[index];
	let previousFile = previousBuild[index];
	if (currentFile !== previousFile) {
		changedFiles.push(currentFile);
	}
}

let changedRoutes = [];

function getFileRegex(file) {
	return new RegExp(`assets/${file}-([a-z0-9]+).js`);
}

let manifestRegex = getFileRegex("manifest");

// check if manifest has changed
if (changedFiles.some((file) => manifestRegex.test(file))) {
	changedRoutes.push(
		...Object.values(remixConfig.routes).map((route) => {
			return route.path ?? "/";
		}),
	);
}

for (let route of Object.values(remixConfig.routes)) {
	// root route is handled by manifest
	if (route.path === "") continue;
	let routeRegex = getFileRegex(route.path ?? "_index");
	if (changedFiles.some((file) => routeRegex.test(file))) {
		changedRoutes.push(route.path ?? "/");
	}
}

let allChangedFiles = [...new Set(changedFiles.concat(changedRoutes))];

let urlsToPurge = allChangedFiles.filter(Boolean).map((file) => {
	return new URL(file, "https://www.mcan.sh").href;
});

// console.log({ changedRoutes, changedFiles, urlsToPurge });
console.log(urlsToPurge.join(", "));
