import fsp from "node:fs/promises";
import { spawnSync } from "node:child_process";
import replace from "replace-in-file";
import glob from "glob";
import slugify from "@sindresorhus/slugify";

async function uploadSourceMapsToSentry() {
  if (
    !process.env.VERCEL &&
    !process.env.VERCEL_GIT_COMMIT_REF &&
    !process.env.VERCEL_GIT_COMMIT_SHA
  ) {
    console.log("Not on Vercel, skipping Sentry release creation");
    return;
  }
  let proposedVersion = slugify(
    process.env.VERCEL_GIT_COMMIT_REF + "-" + process.env.VERCEL_GIT_COMMIT_SHA
  );
  let browserUpload = spawnSync(
    "sentry-cli",
    ["releases", "files", proposedVersion, "upload-sourcemaps", "public/build"],
    { stdio: "inherit" }
  );
  let serverUpload = spawnSync(
    "sentry-cli",
    ["releases", "files", proposedVersion, "upload-sourcemaps", "api"],
    { stdio: "inherit" }
  );

  if (browserUpload.status !== 0) {
    console.error("Error uploading browser sourcemaps to Sentry");
    console.error("Browser: ", browserUpload.stderr);
  }

  if (serverUpload.status !== 0) {
    console.error("Error uploading server sourcemaps to Sentry");
    console.error("Server: ", serverUpload.stderr);
  }

  if (browserUpload.status !== 0 || serverUpload.status !== 0) {
    process.exit(1);
  }

  let finalizeResult = spawnSync(
    "sentry-cli",
    ["releases", "finalize", proposedVersion],
    { encoding: "utf-8" }
  );

  if (finalizeResult.status !== 0) {
    console.error("Error finalizing release");
    process.exit(1);
  }
}

async function removeSourcemapReferences() {
  let files = glob.sync("public/build/**/*.{css,js}");

  let sourcemaps = glob.sync("public/build/**/*.map");

  await Promise.all(sourcemaps.map((file) => fsp.unlink(file)));
  console.log(`deleted ${sourcemaps.length} sourcemaps`);

  let results = await replace({
    files,
    from: [/\/\/# sourceMappingURL=.*/g, /\/\*#.* sourceMappingURL=.*/g],
    to: "",
  });

  console.log(
    `removed ${results.filter((r) => r.hasChanged).length} sourcemap references`
  );
}

async function postBuild() {
  await uploadSourceMapsToSentry();
  await removeSourcemapReferences();
}

postBuild();
