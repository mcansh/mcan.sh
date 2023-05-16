import type { HeadersFunction, LinksFunction } from "@remix-run/node";
import { cacheHeader } from "pretty-cache-header";

import {
  FunHoverLink,
  styles as funHoverLinkStyles,
} from "~/components/fun-hover-link";
import berkeleyMonoStylesHref from "~/fonts/berkeley-mono/berkeley-mono.css";
import berkeleyMonoFontHref from "~/fonts/berkeley-mono/BerkeleyMonoVariable-Regular.woff2";

export const headers: HeadersFunction = () => {
  return {
    "Cache-Control": cacheHeader({
      public: true,
      maxAge: "1 hour",
      staleWhileRevalidate: "2 hours",
      sMaxage: "1 hour",
    }),
    Link: "<https://res.cloudinary.com>; rel=preconnect",
  };
};

export const links: LinksFunction = () => {
  return [
    { rel: "preload", href: funHoverLinkStyles, as: "style" },
    { rel: "stylesheet", href: funHoverLinkStyles },
    { rel: "preload", href: berkeleyMonoStylesHref, as: "style" },
    {
      rel: "preload",
      href: berkeleyMonoFontHref,
      as: "font",
      crossOrigin: "anonymous",
    },
    { rel: "stylesheet", href: berkeleyMonoStylesHref },
  ];
};

export default function IndexPage() {
  return (
    <div className="mx-auto flex h-screen max-w-screen-md flex-col items-center justify-between px-4 text-center">
      <div className="flex flex-1 flex-col items-center justify-center">
        <img
          src="https://res.cloudinary.com/dof0zryca/image/upload/c_fill,f_auto,h_480,w_480/v1624726775/me.jpg"
          alt="Me sitting on a oversized wooden chair at Comerica Park"
          height={240}
          width={240}
          placeholder="transparent"
          className="mx-auto rounded-full"
        />
        <h1 className="mt-4 text-4xl">Logan McAnsh</h1>
        <p className="mt-2 max-w-xs text-center text-lg sm:text-xl md:max-w-sm">
          Senior Software Engineer
        </p>
        <pre className="mt-2 font-thin">Past: Shopify x Remix</pre>
      </div>
      <div className="pb-8-safe">
        <FunHoverLink to="/resume" prefetch="intent">
          Resume
        </FunHoverLink>
      </div>
    </div>
  );
}
