import * as React from "react";
import type { V2_MetaFunction } from "@remix-run/server-runtime";
import type { LinksFunction } from "@netlify/remix-runtime";
import type { ThrownResponse } from "@remix-run/react";
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
  useRouteError,
} from "@remix-run/react";
import clsx from "clsx";
import * as Fathom from "fathom-client";
import type { RequireExactlyOne } from "type-fest";
import appStylesHref from "tailwindcss/tailwind.css";

import type { Match } from "~/@types/handle";
import interFontHref from "~/inter/Inter.var.woff2";
import interStylesHref from "~/inter/inter.css";

import { NonceContext } from "./components/nonce";

export const meta: V2_MetaFunction = () => {
  return [
    { charSet: "utf-8" },
    {
      name: "viewport",
      content: "initial-scale=1.0, width=device-width, viewport-fit=cover",
    },
    {
      title: "Logan McAnsh",
    },
    {
      name: "description",
      content: "personal website for logan mcansh",
    },
    {
      name: "apple-mobile-web-app-status-bar-style",
      content: "black-translucent",
    },
    {
      name: "apple-mobile-web-app-capable",
      content: "yes",
    },
    {
      name: "theme-color",
      content: "#ffffff",
      media: "(prefers-color-scheme: light)",
    },
    {
      name: "theme-color",
      content: "#0f172a",
      media: "(prefers-color-scheme: dark)",
    },
  ];
};

export const links: LinksFunction = () => {
  let iconSizes: Array<number> = [32, 57, 72, 96, 120, 128, 144, 152, 195, 228];

  return [
    { rel: "preload", href: appStylesHref, as: "style" },
    { rel: "preload", href: interStylesHref, as: "style" },
    { rel: "stylesheet", href: appStylesHref },
    { rel: "stylesheet", href: interStylesHref },
    {
      rel: "preload",
      href: interFontHref,
      type: "font/woff2",
      as: "font",
      crossOrigin: "anonymous",
    },
    { rel: "manifest", href: "/manifest.webmanifest" },
    { rel: "icon", href: "/favicon.png", type: "image/png" },
    { rel: "icon", href: "/favicon.ico" },
    ...iconSizes.map((icon) => {
      return {
        href: `/logo-${icon}.png`,
        sizes: `${icon}x${icon}`,
        rel: "apple-touch-icon",
      };
    }),
  ];
};

function useFathom() {
  React.useEffect(() => {
    Fathom.load("EPVCGNZL", {
      excludedDomains: ["localhost"],
      url: "https://thirtyseven-active.b-cdn.net/script.js",
      spa: "auto",
    });
  }, []);
}

function useHandleBodyClassName() {
  let matches = useMatches() as unknown as Array<Match>;
  let handleBodyClassName = matches
    .filter((match) => match.handle?.bodyClassName)
    .map((match) => match.handle?.bodyClassName);

  return handleBodyClassName;
}

export default function App() {
  let handleBodyClassName = useHandleBodyClassName();
  let nonce = React.useContext(NonceContext);
  useFathom();

  return (
    <html lang="en" className="h-full dark:bg-slate-900 dark:text-white">
      <head>
        <Meta />
        <Links />
      </head>
      <body className={clsx("h-full", handleBodyClassName)}>
        <Outlet />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload
          nonce={nonce}
          port={Number(process.env.REMIX_DEV_SERVER_WS_PORT)}
        />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);

  return isRouteErrorResponse(error) ? (
    <BlueScreenOfDeath caughtResponse={error} />
  ) : (
    <BlueScreenOfDeath error={error as Error} />
  );
}

interface BlueScreenOfDeathProps {
  caughtResponse: ThrownResponse<number, any>;
  error: Error;
}

function BlueScreenOfDeath({
  error,
  caughtResponse,
}: RequireExactlyOne<BlueScreenOfDeathProps>) {
  useFathom();

  let handleBodyClassName = useHandleBodyClassName();
  let headingClassName = `inline-block text-3xl font-bold bg-white text-[#0827f5]`;
  let boxClassName = `px-4 py-2 overflow-auto border-4 border-white`;

  return (
    <html lang="en" className="h-full">
      <head>
        <title>Uh-oh!</title>
        <Meta />
        <Links />
      </head>
      <body
        className={clsx(
          "mx-auto min-h-screen w-[90%] max-w-5xl space-y-4 bg-[#0827f5] pt-20 text-center font-mono text-white",
          handleBodyClassName
        )}
      >
        {error ? (
          <>
            <h1 className={headingClassName}>Uncaught Exception!</h1>
            <p>
              If you are not the developer, please click back in your browser
              and try again.
            </p>
            <pre className={boxClassName}>{error.message}</pre>

            {process.env.NODE_ENV === "production" ? (
              <p>
                There was an uncaught exception in your application. Check the
                browser console and/or the server console to inspect the error.
              </p>
            ) : (
              <pre className={clsx(boxClassName, "text-left")}>
                {error.stack}
              </pre>
            )}
          </>
        ) : (
          <>
            <h1 className={headingClassName}>
              {caughtResponse.status} {caughtResponse.statusText}
            </h1>
          </>
        )}
        <Scripts />
        <LiveReload port={Number(process.env.REMIX_DEV_SERVER_WS_PORT)} />
      </body>
    </html>
  );
}
