import ReactDOMServer from 'react-dom/server';
import type { EntryContext } from 'remix';
import { RemixServer, redirect } from 'remix';

// https://securityheaders.com
const cspSettings = {
  'default-src': ["'self'"],
  'img-src': [
    "'self'",
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
  let url = new URL(request.url)
  if (url.hostname === "resume.mcan.sh") {
    return redirect("https://mcan.sh/resume")
  }

  if (process.env.NODE_ENV === 'development') {
    responseHeaders.set('Cache-Control', 'no-cache');
  }

  const markup = ReactDOMServer.renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set('Content-Type', 'text/html');

  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  responseHeaders.set('Content-Security-Policy', contentSecurityPolicy);
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  responseHeaders.set('Referrer-Policy', `origin-when-cross-origin`);
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  responseHeaders.set('X-Frame-Options', `DENY`);
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  responseHeaders.set('X-Content-Type-Options', `nosniff`);
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  responseHeaders.set('X-DNS-Prefetch-Control', `on`);
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  responseHeaders.set(
    'Strict-Transport-Security',
    `max-age=31536000; includeSubDomains; preload`
  );
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  responseHeaders.set(
    'Permissions-Policy',
    `camera=(), microphone=(), geolocation=()`
  );

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
