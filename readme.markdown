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

Put Worker secrets in `.dev.vars`. If that file is missing, the Vite plugin also reads `.env`. `CLOUDINARY_CLOUD_NAME` is required. `SENTRY_REPORT_URL` is required in production. `PUBLIC_ORIGIN` defaults to `https://mcan.sh` in production. In development it stays unset unless you set it.

```sh
CLOUDINARY_CLOUD_NAME=your-cloud-name
```

Start the Vite dev server. It runs the Worker in workerd:

```sh
pnpm run dev
```

Then open <http://localhost:5173> in your browser to see it running.

Build the production client and Worker bundles with `pnpm run build`. The build writes Cloudflare Build Output under `.cloudflare/output/`. Preview that build locally with `pnpm run preview` or `pnpm start`. After you authenticate the Cloudflare CLI, deploy the prebuilt output with `pnpm exec cf deploy --prebuilt`.

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
