#!/usr/bin/env node

import path from "node:path";

import { readConfig } from "@remix-run/dev/dist/config";
import { deleteAsync } from "del";
import Gitignore from "gitignore-fs";
import { globSync } from "glob";
import kleur from "kleur";

async function clean() {
	let remixConfig = await readConfig();
	let cwd = process.cwd();
	let gitignore = new Gitignore();

	let files = globSync("**/*", {
		absolute: true,
		ignore: ["node_modules/**/*"],
		nodir: true,
		cwd,
	});

	let filesToDelete = files.filter((file) => {
		return gitignore.ignoresSync(file);
	});

	if (process.env.NO_CACHE) {
		let rel = path.relative(cwd, remixConfig.cacheDirectory);
		filesToDelete.push(`${rel}/**/*`);
	}

	let deleted = await deleteAsync(filesToDelete);

	if (deleted.length > 0) {
		let deletedPaths = deleted.map((file) => path.relative(cwd, file));
		console.log(`✨ Deleted the following files and directories`);
		console.log(
			kleur.red(deletedPaths.map((file) => "👉 " + file).join("\n") + "\n"),
		);
	}
}

clean().then(
	() => {
		process.exit(0);
	},
	(error) => {
		console.error(error);
		process.exit(1);
	},
);
