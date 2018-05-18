import React, { Fragment } from 'react';
import Link from '../components/Link';
import Headshot from '../components/Headshot';
import H2 from '../components/Heading';
import P from '../components/Paragraph';
import Footer from '../components/Footer';

const Index = () => (
  <Fragment>
    <Headshot />
    <H2>Logan McAnsh</H2>
    <P>
      Making PWAs for <Link href="https://www.powerley.com">Powerley</Link>.
      Student at{' '}
      <Link href="https://flatironschool.com/programs/online-web-developer-career-course/">
        Learn.co
      </Link>.
    </P>
    <Footer />
  </Fragment>
);

export default Index;
