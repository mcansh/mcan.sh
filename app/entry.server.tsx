import ReactDOMServer from 'react-dom/server';
import type { EntryContext } from 'remix';
import { RemixServer } from 'remix';

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const markup = ReactDOMServer.renderToString(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    <RemixServer context={remixContext} url={request.url} />
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: {
      // @ts-expect-error i think @types/web are borked
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      ...Object.fromEntries(responseHeaders),
      'Content-Type': 'text/html',
    },
  });
}
