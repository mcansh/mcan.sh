import * as React from 'react';
import type {
  RouteComponent,
  LoaderFunction,
  MetaFunction,
  HeadersFunction,
} from 'remix';
import { useRouteData } from 'remix';
import { json } from 'remix-utils';

interface RouteData {
  date: string;
}

const loader: LoaderFunction = () =>
  json<RouteData>({ date: new Date().toISOString() });

const meta: MetaFunction = () => ({
  title: 'Resume | Logan McAnsh',
  description: "Logan McAnsh's Resume",
});

const headers: HeadersFunction = () => ({
  'cache-control': 'max-age=600',
  'x-hello-recruiters': '1',
});

const skills: Array<string> = [
  'Node.js',
  'Rest APIs',
  'GraphQL',
  'React',
  'Next.js',
  'Remix Run',
  'TypeScript',
  'TailwindCSS',
  'Accessibility',
  'Performance',
  'ES2015+',
  'Git',
  'Automated Testing',
];

const ResumePage: RouteComponent = () => {
  const data = useRouteData<RouteData>();

  React.useEffect(() => {
    const redirectToPDF = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === 'p') {
        event.preventDefault();
        window.location.assign('/resume.pdf');
      }
    };

    document.addEventListener('keydown', redirectToPDF);
    return () => document.removeEventListener('keydown', redirectToPDF);
  }, []);

  return (
    <div className="h-full border-t-8 border-indigo-600 border-solid">
      <div className="py-4 mx-auto max-w-prose">
        <header className="flex flex-col items-center px-4 pb-2 mb-2 space-x-4 space-y-1 text-center sm:flex-row sm:text-left">
          <div className="relative w-32 h-32 overflow-hidden rounded-full sm:w-40 sm:h-40">
            <div className="w-full h-full scale-125 bg-cover" />
            <img
              alt="Logan McAnsh"
              src="/11698668.jpg"
              height={160}
              width={160}
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
          <div>
            <h1 className="text-4xl font-semibold">Logan McAnsh</h1>
            <a
              className="transition-colors duration-75 ease-in-out text-blue-gray-600 hover:text-blue-gray-300"
              href="mailto:logan+resume@mcan.sh"
            >
              logan+resume@mcan.sh
            </a>
          </div>
        </header>

        <div className="px-4 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold">Summary</h2>
            <p>
              Experienced Full Stack Web Developer, primarily using React and
              Node.js.{' '}
              <span className="block">
                Self taught with experience working solo and with a team, both
                in person and remote settings.
              </span>
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Skills</h2>
            {/* safari doesn't support gap on flex containers, so we need to add a margin to each flex child and set a negative margin on the parent */}
            <ul className="flex flex-row flex-wrap -mx-1">
              {skills.map(skill => (
                <li
                  key={skill}
                  className="px-2 py-1 m-1 tracking-wide text-white bg-indigo-600 rounded-md"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Experience</h2>
            <ul>
              <li>
                <div className="space-y-2">
                  <div>
                    <h3 className="flex flex-col py-2 sm:space-y-0 sm:space-x-2 sm:items-baseline sm:flex-row">
                      <span className="text-xl font-medium">Powerley</span>
                      <span className="text-lg">Web Developer</span>
                      <span>
                        <time dateTime="2016-05-04T00:00:00.000Z">
                          May 2016 -
                        </time>{' '}
                        <time dateTime={data.date}>Present</time>
                      </span>
                    </h3>
                    <ul className="pl-6 space-y-1 list-disc">
                      <li>First member of the web team</li>
                      <li>
                        Created and maintained a suite of modern white label web
                        applications with Next.js to be included in our mobile
                        apps for 7+ clients, which quickly became the second
                        most used area of the app
                      </li>
                      <li>
                        Implemented a suite of utility functions used across our
                        web experiences
                      </li>
                      <li>Designed Sketch plugins</li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Certificates</h2>
            <ul className="pl-6 list-disc">
              <li>CIW Internet Business Associate (2014)</li>
              <li>CIW Web Site Development Associate (2015)</li>
              <li>Testing JavaScript (2019)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
export { headers, loader, meta };
