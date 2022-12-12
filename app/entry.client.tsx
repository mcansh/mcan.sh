import * as React from "react";
import { RemixBrowser, useLocation, useMatches } from "@remix-run/react";
import * as Sentry from "@sentry/remix";
import { hydrateRoot } from "react-dom/client";

Sentry.init({
  dsn: "https://4b455db031a845c3aefc7540b16e3a16@o74198.ingest.sentry.io/268464",
  tracesSampleRate: 1,
  environment: process.env.NODE_ENV,
  tunnel: "/_tunnel",
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.remixRouterInstrumentation(
        React.useEffect,
        useLocation,
        useMatches
      ),
    }),
  ],
});

function hydrate() {
  React.startTransition(() => {
    hydrateRoot(
      document,
      <React.StrictMode>
        <RemixBrowser />
      </React.StrictMode>
    );
  });
}

if (typeof window.requestIdleCallback === "function") {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}
