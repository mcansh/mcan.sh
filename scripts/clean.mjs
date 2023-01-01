#!/usr/bin/env node

import fsp from "node:fs/promises";
import path from "node:path";
import { deleteAsync } from "del";

async function clean() {
  let gitignorePath = path.join(process.cwd(), ".gitignore");
  let gitignore = await fsp.readFile(gitignorePath, "utf8");
  let patterns = gitignore
    .split("\n")
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.replace(/\/$/, ""));

  let keep = [".vercel", "node_modules"].map((k) =>
    path.join(process.cwd(), k)
  );

  let relativePatterns = patterns
    .map((pattern) => {
      let noLeadingSlash = pattern.startsWith("/") ? pattern.slice(1) : pattern;
      return path.join(process.cwd(), noLeadingSlash);
    })
    .filter((pattern) => {
      return !keep.includes(pattern);
    });

  await deleteAsync(relativePatterns);

  console.log("✨");
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
