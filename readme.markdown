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

Now you can start the server:

```sh
pnpm run dev
```

Then open <http://localhost:3000> in your browser to see it running.

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
