import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Div100VH from 'react-div-100vh';
import { Link } from '@mcansh/custom-next-link';

import { StyledLink } from '~/components/style/styled-link';

const Work: React.FC<{
  date: string;
  title: string;
  company: string;
}> = ({ date, title, company, children }) => (
  <div
    className="work"
    css={`
      h3 {
        margin: 0;
        text-transform: uppercase;
        font-size: 1.8rem;
        font-weight: 700;
      }

      h2 {
        margin: 0;
        font-size: 4.5rem;
        font-weight: 700;
      }

      & > div {
        font-size: 1.6rem;
        color: var(--text);
        line-height: 2;
        color: 200ms color ease;
        margin: 1.6rem 0;
      }

      @media (max-width: 1200px) {
        h2 {
          font-size: 3.2rem;
        }
      }
    `}
  >
    <h3>{date}</h3>
    <h2>
      {title} – {company}
    </h2>
    {children && <div>{children}</div>}
  </div>
);

const Resume: NextPage = () => {
  const [activeSection /*_setActiveSection*/] = React.useState('#experience');
  return (
    <Div100VH
      css={`
        display: flex;
        margin: 0 2rem;
        justify-content: center;
        max-width: 100rem;
        padding-top: 10rem;
        @media (max-width: 1200px) {
          flex-direction: column;
          padding-top: 3rem;
          justify-content: flex-start;
        }
      `}
    >
      <Head>
        <title>Logan McAnsh — Resume</title>
      </Head>
      <aside
        css={`
          width: 20rem;
          padding: 0 5rem 0 0;
          position: sticky;
          top: 0;

          @media (max-width: 1200px) {
            margin-bottom: 2rem;
            position: relative;
          }

          ul {
            padding: 0;
            list-style: none;
          }

          a {
            text-decoration: none;
            line-height: 2.5;
            color: 200ms color ease;
            font-size: 1.6rem;
            color: #999;
            &.active {
              color: black;
            }

            @media (prefers-color-scheme: dark) {
              color: #ccc;
              &.active {
                color: white;
              }
            }
          }
        `}
      >
        <nav>
          <ul>
            <li>
              <a
                href="#experience"
                className={activeSection === '#experience' ? 'active' : ''}
              >
                Experience
              </a>
            </li>
            <li>
              <a
                href="#education"
                className={activeSection === '#education' ? 'active' : ''}
              >
                Education
              </a>
            </li>
            <li>
              <a
                href="#information"
                className={activeSection === '#information' ? 'active' : ''}
              >
                Information
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <main
        css={`
          width: 700px;
          @media (max-width: 1200px) {
            width: 100%;
          }
        `}
      >
        <Work
          date="May 2016 - Present"
          title="Lead Web Developer"
          company="Powerley"
        >
          <ul>
            <li>`git init`ed the web team</li>
            <li>
              Worked closely with the app teams to implement various PWA web
              views into the app
            </li>
            <li>
              Created Sketch plugins for the design team to make theming the app
              experience a breeze.
            </li>
            <li>
              Led the frontend efforts for the{' '}
              <Link href="https://blog.powerley.com/utilities-are-giving-the-home-a-voice-and-a-brain/?utm_source=mcan.sh">
                <StyledLink>Advisor</StyledLink>
              </Link>{' '}
              progressive web app
            </li>
            <li>
              Created internal tools and dashboards to view performance metrics
              for app reviews and common utilities including target
              white-labeling for Advisor, and web apps.
            </li>
          </ul>
        </Work>
      </main>
    </Div100VH>
  );
};

export default Resume;
