import * as React from 'react';
import type { RouteComponent, MetaFunction, HeadersFunction } from 'remix';

const meta: MetaFunction = () => ({
  title: 'Resume | Logan McAnsh',
  description: "Logan McAnsh's Resume",
});

const headers: HeadersFunction = () => ({
  'cache-control': 'max-age=600',
  'x-hello-recruiters': '1',
});

const date = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
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

interface BaseExperience {
  company: string;
  title: string;
  start: Date;
  duties: Array<string>;
}

interface PastExperience extends BaseExperience {
  end: Date;
  current?: never;
}

interface CurrentExperience extends BaseExperience {
  end?: never;
  current: true;
}

const experiences: Array<CurrentExperience | PastExperience> = [
  {
    company: 'Remix Run',
    title: 'Software Engineer',
    start: new Date(2021, 7, 2),
    current: true,
    duties: [],
  },
  {
    company: 'Powerley',
    title: 'Frontend Web Developer',
    start: new Date(2016, 4, 4),
    end: new Date(2021, 6, 23),
    duties: [
      'First member of the web team',
      'Created and maintained a suite of modern white label web applications with Next.js to be included in our mobile apps for 7+ clients, which quickly became the most used areas of the app',
      'Implemented a suite of utility functions used across our web experiences',
      'Designed Sketch plugins',
    ],
  },
];

const ResumePage: RouteComponent = () => {
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
    <div className="h-full border-t-8 border-indigo-600 border-solid pb-8-safe">
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
              Node.js.
              <br />
              Self taught with experience working solo and with a team, both in
              person and remote settings.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Skills</h2>
            {/* safari doesn't support gap on flex containers, so we need to add a margin to each flex child and set a negative margin on the parent */}
            <ul className="flex flex-row flex-wrap -mx-1 supports-gap:gap-2 supports-gap:mx-0 supports-gap:my-1">
              {skills.map(skill => (
                <li
                  key={skill}
                  className="px-2 py-1 m-1 tracking-wide text-white bg-indigo-600 rounded-md supports-gap:m-0"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Experience</h2>
            <ul>
              {experiences.map(experience => (
                <div
                  className="space-y-2"
                  key={`${experience.company}-${experience.start}`}
                >
                  <div>
                    <h3 className="flex flex-col py-2 sm:space-y-0 sm:space-x-2 sm:items-baseline sm:flex-row">
                      <span className="text-xl font-medium">
                        {experience.company}
                      </span>
                      <span className="text-lg">{experience.title}</span>
                      <span>
                        <time dateTime={experience.start.toISOString()}>
                          {date.format(experience.start)}
                        </time>
                        {' - '}
                        <time
                          dateTime={
                            experience.current
                              ? new Date().toISOString()
                              : experience.end.toISOString()
                          }
                        >
                          {experience.current
                            ? 'Present'
                            : date.format(experience.end)}
                        </time>
                      </span>
                    </h3>
                    {experience.duties.length > 0 && (
                      <ul className="pl-6 space-y-1 list-disc">
                        {experience.duties.map(duty => (
                          <li key={duty}>{duty}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
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
export { headers, meta };
