import React from 'react';
import Head from 'next/head';
import App, { Container } from 'next/app';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { version, repository, description } from '../package.json';
import Page from '../components/Page';
import { theme, fontFace } from '../style';

const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
  }

  html {
    font-size: 10px;
    touch-action: manipulation;
  }

  html, body, #__next {
    height: 100%;
  }

  body {
    line-height: 1.3;
    font-family: 'Gotham Pro', -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
    text-align: center;

    @media (prefers-color-scheme: light) {
      background: #f3f4f6;
    }

    background: ${props => props.theme.background};
  }

  ${fontFace};
`;

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
        <ThemeProvider theme={theme}>
          <>
            <Head>
              <title>Logan McAnsh</title>
              <meta name="description" content={description} />
              <meta charSet="utf-8" />
              <meta httpEquiv="x-ua-compatible" content="ie=edge" />
              <meta
                name="viewport"
                content="initial-scale=1.0, width=device-width, viewport-fit=cover"
              />
              <link rel="shortcut icon" href="/static/images/favicon.png" />
            </Head>
            <GlobalStyle />
            <Page>
              <Component {...pageProps} />
            </Page>
          </>
        </ThemeProvider>
      </Container>
    );
  }
}

export default MyApp;
