import type { HeadersFunction, LinksFunction } from "@remix-run/node";
import type {
  V2_HtmlMetaDescriptor,
  V2_MetaFunction,
} from "@remix-run/react/dist/routeModules";

import {
  FunHoverLink,
  styles as funHoverLinkStyles,
} from "../components/fun-hover-link";

export const meta: V2_MetaFunction = ({ matches }) => {
  return [
    ...(matches.map(
      (match) => match.meta
    ) as unknown as V2_HtmlMetaDescriptor[]),
    { title: "Logan McAnsh" },
    { name: "description", content: "personal website for logan mcansh" },
  ];
};

export const headers: HeadersFunction = () => {
  return {
    "Cache-Control": `public, max-age=3600, s-maxage=3600, stale-while-revalidate`,
    Link: "<https://res.cloudinary.com>; rel=preconnect",
  };
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: funHoverLinkStyles }];
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
          Senior Software Engineer at{" "}
          <FunHoverLink
            to="https://shopify.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Shopify
          </FunHoverLink>{" "}
          working on{" "}
          <FunHoverLink
            to="https://remix.run"
            target="_blank"
            rel="noopener noreferrer"
          >
            Remix
          </FunHoverLink>
        </p>
      </div>
      <div className="pb-8-safe">
        <FunHoverLink to="/resume" prefetch="intent">
          Resume
        </FunHoverLink>
      </div>
    </div>
  );
}
