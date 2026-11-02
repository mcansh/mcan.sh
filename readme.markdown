# mcan.sh

This is my [website](https://mcan.sh). It's pretty simple.

## Running Locally

Get the source:

```sh
gh repo clone mcansh/mcan.sh
cd mcan.sh
```

Get the dependencies:

```sh
pnpm install
```

Put Worker values in `.dev.vars`. If that file is missing, the Vite plugin also reads `.env`. Names must be declared in `cloudflare.config.ts` or the Worker never sees them. `CLOUDINARY_CLOUD_NAME` is required. `SENTRY_REPORT_URL` is required in production. `PUBLIC_ORIGIN` is optional. Production defaults it to `https://mcan.sh` when it is unset. In development it stays unset unless you set it in `.dev.vars`. A `.dev.vars` file replaces shell environment values for those declared names.

`SENTRY_DSN` is optional at runtime. If you leave it unset, the Worker still serves the site and does not send errors to Sentry. To report errors from the local Worker, add `SENTRY_DSN` to `.dev.vars`. `cloudflare.config.ts` declares that name, so the Worker reads it from `.dev.vars`. To set the production secret, run `pnpm exec cf workers secrets update SENTRY_DSN`. If that name is missing on the Worker, `npx cf workers versions create` fails. Set the secret with the command above before Workers Builds can upload a version. Do not set this secret through the Cloudflare API. An API-written secret breaks `cf` builds that use `--strict`.

```sh
CLOUDINARY_CLOUD_NAME=your-cloud-name
```

Start the Vite dev server. It runs the Worker in workerd:

```sh
pnpm run dev
```

Then open <http://localhost:5173> in your browser to see it running.

`cloudflare.config.ts` names the Worker `personal-website`. That name must match the Worker in the Cloudflare account. Build the production client and Worker bundles with `pnpm run build`. The build writes Cloudflare Build Output under `.cloudflare/output/`. Preview that build locally with `pnpm run preview` or `pnpm start`. After you authenticate the Cloudflare CLI, deploy the prebuilt output with `pnpm exec cf deploy --prebuilt`. Workers Builds uses the same Worker name. Its version command is `npx cf workers versions create`. Its deploy command is `npx wrangler deploy`.

## Testing

Run the Node tests:

```sh
pnpm test
```

For browser and end-to-end tests, install Chromium and its system dependencies before running the suite:

```sh
pnpm exec playwright install --with-deps chromium
pnpm test:browser
```

Repeat the install step after updating Playwright. On Linux, `--with-deps` may require administrator privileges.
