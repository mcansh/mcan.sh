import { PassThrough } from 'stream';

// @ts-expect-error types need updating
import { renderToPipeableStream } from 'react-dom/server';
import type { EntryContext, Headers } from '@remix-run/node';
import { redirect, Response } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import { createSecureHeaders } from '@mcansh/remix-secure-headers';
import isbot from 'isbot';

const ABORT_DELAY = 5_000;

const securityheaders = createSecureHeaders({
  'Content-Security-Policy': {
    'default-src': ["'self'"],
    'img-src': [
      "'self'",
      'https://res.cloudinary.com/dof0zryca/image/upload/',
      'https://thirtyseven-active.b-cdn.net',
    ],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      'https://thirtyseven-active.b-cdn.net/script.js',
    ],
    'style-src': ["'self'", "'unsafe-inline'"],
    'media-src': ["'none'"],
    'connect-src': ['*'],
  },
  'Referrer-Policy': `origin-when-cross-origin`,
  'X-Frame-Options': `DENY`,
  'X-Content-Type-Options': `nosniff`,
  'X-DNS-Prefetch-Control': `on`,

  'Strict-Transport-Security': {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  'Permissions-Policy': {
    camera: ['none'],
    microphone: ['none'],
    geolocation: ['none'],
  },
});

export default function handleDocumentRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const url = new URL(request.url);
  if (url.hostname === 'resume.mcan.sh') {
    return redirect('https://mcan.sh/resume');
  }

  const callbackName = isbot(request.headers.get('user-agent'))
    ? 'onAllReady'
    : 'onShellReady';

  return new Promise(resolve => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        [callbackName]() {
          const body = new PassThrough();

          if (process.env.NODE_ENV === 'development') {
            responseHeaders.set('Cache-Control', 'no-cache');
          }

          responseHeaders.set('Content-Type', 'text/html');
          for (const header of securityheaders) {
            responseHeaders.set(...header);
          }

          resolve(
            new Response(body, {
              status: didError ? 500 : responseStatusCode,
              headers: responseHeaders,
            })
          );
          pipe(body);
        },
        onError(error: Error) {
          didError = true;
          console.error(error);
        },
      }
    );
    /* same reason as the typescript ignore */
    /* eslint-disable-next-line @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-argument */
    setTimeout(abort, ABORT_DELAY);
  });
}
