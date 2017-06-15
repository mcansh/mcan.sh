import React from 'react';
import Link from 'next/link';
import Main from '../components/Main';
import Headshot from '../components/Headshot';
import H2 from '../components/Heading';
import P from '../components/Paragraph';
import Footer from '../components/Footer';


const Index = () => (
  <div>
    <Main>
      <Headshot />
      <H2>Logan McAnsh</H2>
      <P>Front End Web Developer for <Link href="http://www.powerley.com" rel="noopener"><a target="_blank">Powerley</a></Link>. Student at <Link href="https://flatironschool.com/programs/online-web-developer-career-course/" rel="noopener"><a target="_blank">Learn.co</a></Link> taking the Full-Stack Web Developer course. You can keep up with projects from both on <Link href="http://github.com/mcansh" rel="noopener"><a target="_blank">GitHub</a></Link>. I occasionally <Link href="http://twitter.com/logansmcansh" rel="noopener"><a target="_blank">tweet</a></Link>.</P>
    </Main>
    <Footer>&copy; 2017 Logan McAnsh</Footer>
  </div>
);

export default Index;
