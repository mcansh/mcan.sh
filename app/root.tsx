import * as React from 'react';
import { Meta, Links, Scripts, LiveReload } from 'remix';
import type { LinksFunction } from 'remix';
import { Outlet, useLocation } from 'react-router-dom';
import type {
  ErrorBoundaryComponent,
  RouteComponent,
} from '@remix-run/react/routeModules';
import * as Fathom from 'fathom-client';

import tailwindUrl from './styles/global.css';
import interUrl from './styles/inter.css';

const iconSizes = [32, 57, 72, 96, 120, 128, 144, 152, 195, 228];

const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwindUrl },
  { rel: 'stylesheet', href: interUrl },
  {
    rel: 'preload',
    href: '/inter/Inter-roman.var.woff2?v=3.19',
    type: 'font/woff2',
    as: 'font',
  },
];

const Document: React.FC = ({ children }) => {
  const location = useLocation();

  React.useEffect(() => {
    Fathom.load('EPVCGNZL', {
      excludedDomains: ['localhost'],
      url: 'https://kiwi.mcan.sh/script.js',
    });
  }, []);

  React.useEffect(() => {
    Fathom.trackPageview({
      url: location.pathname,
    });
  }, [location.pathname]);

  return (
    <html lang="en" className="h-screen">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, viewport-fit=cover"
        />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="icon" href="/favicon.png" />
        <link rel="icon" href="/favicon.ico" />

        <meta
          name="theme-color"
          content="#fff"
          // @ts-expect-error Safari 15 supports this
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#1d2330"
          // @ts-expect-error Safari 15 supports this
          media="(prefers-color-scheme: dark)"
        />
        {iconSizes.map(icon => {
          const size = `${icon}x${icon}`;
          return (
            <link
              key={size}
              rel="apple-touch-icon"
              sizes={size}
              href={`/static/images/logo/logo-${icon}.png`}
            />
          );
        })}
        <Meta />
        <Links />
      </head>
      <body className="h-screen bg-white dark:bg-gray-800 dark:text-white">
        {children}
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
};

const App: RouteComponent = () => (
  <Document>
    <Outlet />
  </Document>
);

const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => (
  <Document>
    <h1>App Error</h1>
    <pre>{error.message}</pre>
    <p>
      Replace this UI with what you want users to see when your app throws
      uncaught errors.
    </p>
  </Document>
);

export default App;
export { ErrorBoundary, links };
