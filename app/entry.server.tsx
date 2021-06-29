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
    <RemixServer context={remixContext} url={request.url} />
  );

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: {
      // @ts-expect-error headers are iterable
      ...Object.fromEntries(responseHeaders),
      'Content-Type': 'text/html',
    },
  });
}
