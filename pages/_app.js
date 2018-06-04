import React from 'react';
import App, { Container } from 'next/app';
import { ThemeProvider, injectGlobal } from 'styled-components';
import { version, repository } from '../package.json';
import Page from '../components/Page';
import { colors, fontFace } from '../style';

injectGlobal`
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

  body {
    line-height: 1.3;
    font-family: 'Gotham Pro', sans-serif;
    text-align: center;
    min-height: 100vh;
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

export const { Consumer, Provider } = React.createContext();

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  state = {
    theme: 'light',
  };

  toggleTheme = e => {
    if (e) {
      e.preventDefault();
    }

    this.setState({ theme: this.state.theme === 'light' ? 'dark' : 'light' });
  };

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <ThemeProvider theme={{ mode: this.state.theme, ...colors }}>
          <Provider value={{ toggleTheme: this.toggleTheme }}>
            <Page>
              <Component {...pageProps} />
            </Page>
          </Provider>
        </ThemeProvider>
      </Container>
    );
  }
}

export default MyApp;
