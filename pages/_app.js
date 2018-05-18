import React from 'react';
import App, { Container } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { version, repository } from '../package.json';
import Page from '../components/Page';
import { colors } from '../style';

if (global.document) {
  const info = [
    `Version: ${version}`,
    `You can find the code here: https://github.com/${repository}`,
  ];
  // eslint-disable-next-line no-console
  info.forEach(message => console.log(message));
}

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <ThemeProvider theme={colors}>
          <Page>
            <Component {...pageProps} />
          </Page>
        </ThemeProvider>
      </Container>
    );
  }
}

export default MyApp;
