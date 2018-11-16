import React from 'react';
import Link from '../components/Link';
import Headshot from '../components/Headshot';
import H2 from '../components/Heading';
import Text from '../components/Paragraph';
import Footer from '../components/Footer';

const Index = () => (
  <>
    <Headshot />
    <H2>Logan McAnsh</H2>
    <Text>
      Making PWAs for <Link href="https://www.powerley.com">Powerley</Link>.
      Student at{' '}
      <Link href="https://flatironschool.com/programs/online-web-developer-career-course/">
        Learn.co
      </Link>
      .
    </Text>
    <Footer />
  </>
);

export default Index;
