import ReactDOMServer from 'react-dom/server';
import type { EntryContext } from 'remix';
import { RemixServer, redirect } from 'remix';
import { createSecureHeaders } from '@mcansh/remix-secure-headers';

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

function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const url = new URL(request.url);
  if (url.hostname === 'resume.mcan.sh') {
    return redirect('https://mcan.sh/resume');
  }

  if (process.env.NODE_ENV === 'development') {
    responseHeaders.set('Cache-Control', 'no-cache');
  }

  const markup = ReactDOMServer.renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set('Content-Type', 'text/html');

  for (const header of securityheaders) {
    responseHeaders.set(...header);
  }

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}

export default handleRequest;
