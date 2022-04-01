import * as React from 'react';
import type {
  ErrorBoundaryComponent,
  LinkDescriptor,
  LinksFunction,
  MetaFunction,
  RouteComponent,
} from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  useCatch,
  useMatches,
} from '@remix-run/react';
import clsx from 'clsx';

import tailwindUrl from './styles/global.css';
import interUrl from './styles/inter.css';
import type { Match } from './@types/handle';

const meta: MetaFunction = () => ({
  viewport: 'initial-scale=1.0, width=device-width, viewport-fit=cover',
  'apple-mobile-web-app-status-bar-style': 'black-translucent',
  'apple-mobile-web-app-capable': 'yes',
  charset: 'utf-8',
  'theme-color': [
    {
      name: 'theme-color',
      content: '#fff',
      media: '(prefers-color-scheme: light)',
    },
    {
      name: 'theme-color',
      content: '#1d2330',
      media: '(prefers-color-scheme: dark)',
    },
  ],
});

const iconSizes = [32, 57, 72, 96, 120, 128, 144, 152, 195, 228];

const links: LinksFunction = () => {
  const appleTouchIcons: Array<LinkDescriptor> = iconSizes.map(icon => {
    const size = `${icon}x${icon}`;
    return {
      href: `/static/images/logo/logo-${icon}.png`,
      sizes: size,
      rel: 'apple-touch-icon',
    };
  });

  return [
    { rel: 'stylesheet', href: tailwindUrl },
    { rel: 'stylesheet', href: interUrl },
    {
      rel: 'preload',
      href: '/inter/Inter-roman.var.woff2?v=3.19',
      type: 'font/woff2',
      as: 'font',
    },
    { rel: 'icon', href: '/favicon.png', type: 'image/png' },
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'manifest', href: '/manifest.webmanifest' },
    ...appleTouchIcons,
  ];
};

interface DocumentProps {
  bodyClassName?: string;
  title?: string;
}

const Document: React.FC<DocumentProps> = ({
  children,
  bodyClassName,
  title,
}) => {
  const matches = useMatches() as unknown as Array<Match>;
  const handleBodyClassName = matches
    .filter(match => match.handle?.bodyClassName)
    .map(match => match.handle?.bodyClassName);

  return (
    <html lang="en" className="h-screen">
      <head>
        {title && <title>{title}</title>}
        <Meta />
        <Links />
      </head>
      <body className={clsx(bodyClassName, handleBodyClassName)}>
        {children}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
};

const App: RouteComponent = () => (
  <Document bodyClassName="h-min-screen">
    <Outlet />
  </Document>
);

const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error(error);

  return (
    <Document
      title="Uh-oh!"
      bodyClassName="bg-[#0827f5] min-h-screen w-[90%] max-w-5xl mx-auto pt-20 space-y-4 font-mono text-center text-white"
    >
      <h1 className="inline-block text-3xl font-bold bg-white text-[#0827f5]">
        Uncaught Exception!
      </h1>
      <p>
        If you are not the developer, please click back in your browser and try
        again.
      </p>
      <pre className="px-4 py-2 overflow-auto border-4 border-white">
        {error.message}
      </pre>
      <p>
        There was an uncaught exception in your application. Check the browser
        console and/or the server console to inspect the error.
      </p>
    </Document>
  );
};

const CatchBoundary: React.VFC = () => {
  const caught = useCatch();

  switch (caught.status) {
    case 401:
    case 404:
      return (
        <Document title={`${caught.status} ${caught.statusText}`}>
          <h1>
            {caught.status} {caught.statusText}
          </h1>
        </Document>
      );

    default:
      throw new Error(
        `Unexpected caught response with status: ${caught.status}`
      );
  }
};

export default App;
export { CatchBoundary, ErrorBoundary, links, meta };
