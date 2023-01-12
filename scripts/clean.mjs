#!/usr/bin/env node

import fsp from "node:fs/promises";
import path from "node:path";
import { deleteAsync } from "del";
import kleur from "kleur";

async function clean() {
  let gitignorePath = path.join(process.cwd(), ".gitignore");
  let gitignore = await fsp.readFile(gitignorePath, "utf8");
  let patterns = gitignore
    .split("\n")
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.replace(/\/$/, ""));

  let relativePatterns = patterns.map((pattern) => {
    let noLeadingSlash = pattern.startsWith("/") ? pattern.slice(1) : pattern;
    return path.join(process.cwd(), noLeadingSlash);
  });

  let deleted = await deleteAsync(relativePatterns, {
    ignore: [".vercel", "node_modules"].map((p) => path.join(process.cwd(), p)),
  });

  if (deleted.length > 0) {
    let deletedPaths = deleted.map((d) => path.relative(process.cwd(), d));
    console.log(`✨ Deleted the following files and directories`);
    console.log(kleur.red(deletedPaths.join("\n") + "\n"));
  }
}

clean().then(
  () => {
    process.exit(0);
  },
  (error) => {
    console.error(error);
    process.exit(1);
  }
);
