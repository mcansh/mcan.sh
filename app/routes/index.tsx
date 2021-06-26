import type {
  MetaFunction,
  LinksFunction,
  RouteComponent,
  HeadersFunction,
} from 'remix';

import { FunHoverLink } from '../components/fun-hover-link';

const meta: MetaFunction = () => ({
  title: 'Logan McAnsh',
  description: 'personal website for logan mcansh',
});

const headers: HeadersFunction = () => ({
  'Cache-Control':
    'public, max-age=3600, s-maxage=3600, stale-while-revalidate=3600',
});

const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: FunHoverLink.styles,
  },
];

const IndexPage: RouteComponent = () => (
  <div className="flex flex-col items-center justify-center h-screen max-w-screen-md px-4 mx-auto py-8-safe">
    <div className="flex flex-col items-center justify-center flex-1">
      <img
        src="https://res.cloudinary.com/dof0zryca/image/upload/c_fill,f_auto,h_480,w_480/v1624726775/me.jpg"
        alt="Why it's me, Logan McAnsh"
        height={240}
        width={240}
        placeholder="transparent"
        className="rounded-full"
      />
      <h1 className="mt-4 text-4xl">Logan McAnsh</h1>
      <p className="text-lg text-center sm:text-xl">
        Making{' '}
        <FunHoverLink
          href="https://blog.powerley.com/utilities-are-giving-the-home-a-voice-and-a-brain/?utm_source=mcan.sh"
          target="_blank"
          rel="noopener noreferrer"
        >
          Advisor
        </FunHoverLink>{' '}
        and Home Profile for{' '}
        <FunHoverLink
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.powerley.com"
        >
          Powerley
        </FunHoverLink>
      </p>
    </div>
    <FunHoverLink href="/resume">Resume</FunHoverLink>
  </div>
);

export default IndexPage;
export { headers, meta, links };
