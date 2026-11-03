# Configure Sentry

1. Add your project's public DSN to the local `.env` file.

   ```dotenv
   SENTRY_DSN=https://public-key@ingest.example.com/123
   ```

   Vite embeds this exact variable in the browser bundle at build time. There is no meta tag or runtime browser configuration. Use a public DSN, never a Sentry authentication token.

2. Add `SENTRY_DSN` to the production Worker's secrets. With the value available as a shell environment variable, the installed cf CLI accepts:

   ```sh
   pnpm exec cf workers secrets update SENTRY_DSN --worker personal-website --text "$SENTRY_DSN"
   ```

   This command creates a Worker version with the secret. Include that version in your normal deployment process.

   Keep the existing `SENTRY_REPORT_URL` secret configured too. The Cloudflare configuration declares it as required. For a new Worker, use the DSN-derived security endpoint described below.

3. Set the same `SENTRY_DSN` in the production build environment before running `pnpm build`. A Worker secret is available at runtime and does not populate the browser bundle. Rebuild and deploy the browser assets when changing the DSN. Keep the build value and Worker secret identical so the server's CSP permits browser error envelopes.

4. Run `pnpm build` and `pnpm preview` to check the production build locally. Error reporting runs only in production mode with a configured DSN. `pnpm dev` does not send errors. Builds without a DSN leave browser reporting disabled.

The browser SDK captures unhandled exceptions, rejected promises, and Remix component errors. The Cloudflare SDK captures caught request failures and streamed rendering errors. Request cancellation does not report the abort reason. The native Worker wrapper skips instrumentation for `HEAD` and `OPTIONS` requests.

Both SDKs disable automatic collection of user identity, cookies, HTTP headers, HTTP bodies, and URL query parameters. Tracing, session replay, and source-map uploads are not configured.

## Configure CSP reporting

The DSN supplies the default Sentry security reporting URL. For the example above, that URL is `https://ingest.example.com/api/123/security/?sentry_key=public-key`. Set `SENTRY_REPORT_URL` to override it with another HTTP(S) reporting endpoint. Production requires a reporting endpoint from either variable.

Responses include `report-to csp-endpoint` and a matching `Reporting-Endpoints` header. The legacy `report-uri` directive uses the same URL. These headers apply to documents, static resources, missing routes, and caught server errors.

The configured DSN's origin is allowed by `connect-src` for browser error envelopes. Script nonces and the existing `strict-dynamic` policy remain enforced. The SDK is bundled with the app and needs no external script host.

CSP reports can contain blocked URLs and document URLs. The SDK's data collection settings do not filter reports sent directly by the browser.
