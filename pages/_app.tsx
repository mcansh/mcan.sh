import React from 'react';
import App, { Container } from 'next/app';
import Page from '~/components/page';

// @ts-ignore
if (global.document) {
  const info = [
    `Version: ${process.env.VERSION}`,
    `You can find the code here: https://github.com/${process.env.REPO}`,
  ];
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
        <Page>
          <Component {...pageProps} />
        </Page>
      </Container>
    );
  }
}

export default MyApp;
