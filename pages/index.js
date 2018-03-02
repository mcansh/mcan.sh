import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Page from '../components/Page';
import Link from '../components/Link';
import Headshot from '../components/Headshot';
import H2 from '../components/Heading';
import P from '../components/Paragraph';
import Footer from '../components/Footer';

class Index extends Component {
  static getInitialProps() {
    const buildTime = Date.now();

    return { buildTime };
  }

  static propTypes = {
    buildTime: PropTypes.number.isRequired,
  };

  componentDidMount = () => {
    console.log(`built at: ${this.props.buildTime}`);
  };

  render() {
    return (
      <Page>
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
      </Page>
    );
  }
}

export default Index;
