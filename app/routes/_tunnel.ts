import type { DataFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { captureException } from "@sentry/remix";

// Change host appropriately if you run your own Sentry instance.
const sentryHost = "o74198.ingest.sentry.io";

// Set knownProjectIds to an array with your Sentry project IDs which you
// want to accept through this proxy.
const knownProjectIds = new Set(["268464"]);

async function handler({ request }: DataFunctionArgs) {
  try {
    let envelope = await request.text();
    let pieces = envelope.split("\n");
    let header = JSON.parse(pieces[0]);
    // DSNs are of the form `https://<key>@o<orgId>.ingest.sentry.io/<projectId>`
    let { host, pathname } = new URL(header.dsn);
    // Remove leading slash
    let projectId = pathname.substring(1);

    if (host !== sentryHost) {
      throw new Error(`invalid host: ${host}`);
    }

    if (!knownProjectIds.has(projectId)) {
      throw new Error(`invalid project id: ${projectId}`);
    }

    let sentryIngestURL = `https://${sentryHost}/api/${projectId}/envelope/`;
    let sentryResponse = await fetch(sentryIngestURL, {
      method: "POST",
      body: envelope,
    });

    // Relay response from Sentry servers to front end
    return new Response(sentryResponse.body, {
      status: sentryResponse.status,
      headers: sentryResponse.headers,
    });
  } catch (error) {
    captureException(error);
    return json({ status: "invalid request" }, { status: 400 });
  }
}

export const loader = handler;
export const action = handler;
