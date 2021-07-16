import ReactDOMServer from 'react-dom/server';
import type { EntryContext } from 'remix';
import { RemixServer } from 'remix';

// https://securityheaders.com
const cspSettings = {
  'default-src': ["'self'"],
  'img-src': [
    'https://res.cloudinary.com/dof0zryca/image/upload/',
    'https://kiwi.mcan.sh',
  ],
  'script-src': ["'self'", "'unsafe-inline'", 'https://kiwi.mcan.sh/script.js'],
  'style-src': ["'self'", "'unsafe-inline'"],
  'media-src': ["'none'"],
  'connect-src': ['*'],
};

const contentSecurityPolicy = `${Object.entries(cspSettings)
  .map(([key, val]) => `${key} ${val.filter(Boolean).join(' ')}`)
  .join(';')}`;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  if (process.env.NODE_ENV === 'development') {
    responseHeaders.set('Cache-Control', 'no-cache');
  }

  const markup = ReactDOMServer.renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: {
      // @ts-expect-error i think @types/web are borked
      ...Object.fromEntries(responseHeaders),
      'Content-Type': `text/html`,
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
      'Content-Security-Policy': contentSecurityPolicy,
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
      'Referrer-Policy': `origin-when-cross-origin`,
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
      'X-Frame-Options': `DENY`,
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
      'X-Content-Type-Options': `nosniff`,
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
      'X-DNS-Prefetch-Control': `on`,
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
      'Strict-Transport-Security': `max-age=31536000; includeSubDomains; preload`,
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
      'Permissions-Policy': `camera=(), microphone=(), geolocation=()`,
    },
  });
}
