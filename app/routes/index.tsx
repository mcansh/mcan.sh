import type {
  HeadersFunction,
  LinksFunction,
  MetaFunction,
} from '@remix-run/node';

import {
  FunHoverLink,
  styles as funHoverLinkStyles,
} from '../components/fun-hover-link';

export const meta: MetaFunction = () => ({
  title: 'Logan McAnsh',
  description: 'personal website for logan mcansh',
});

export const headers: HeadersFunction = () => ({
  'Cache-Control': `public, max-age=3600, s-maxage=3600, stale-while-revalidate`,
});

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: funHoverLinkStyles }];
};

export default function IndexPage() {
  return (
    <div className="flex flex-col items-center justify-between h-screen max-w-screen-md px-4 mx-auto text-center">
      <div className="flex flex-col items-center justify-center flex-1">
        <img
          src="https://res.cloudinary.com/dof0zryca/image/upload/c_fill,f_auto,h_480,w_480/v1624726775/me.jpg"
          alt="Why it's me, Logan McAnsh"
          height={240}
          width={240}
          placeholder="transparent"
          className="mx-auto rounded-full"
        />
        <h1 className="mt-4 text-4xl">Logan McAnsh</h1>
        <p className="mt-2 text-lg text-center sm:text-xl">
          Software Engineer at{' '}
          <FunHoverLink
            href="https://remix.run"
            target="_blank"
            rel="noopener noreferrer"
          >
            Remix
          </FunHoverLink>
        </p>
      </div>
      <div className="pb-8-safe">
        <FunHoverLink href="/resume">Resume</FunHoverLink>
      </div>
    </div>
  );
}
