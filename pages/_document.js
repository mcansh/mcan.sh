import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

class Page extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();
    const page = renderPage(App => props =>
      sheet.collectStyles(<App {...props} />)
    );
    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }

  render() {
    const { styleTags } = this.props;
    return (
      <html lang="en">
        <Head>
          <title>Logan McAnsh</title>
          {styleTags}
            <meta charSet="utf-8" />
              <meta
                name="viewport"
                content="initial-scale=1.0, width=device-width, viewport-fit=cover"
              />
                <link
                  rel="shortcut icon"
                  href="https://mcan.sh/assets/img/favicon.png"
                />
        </Head>
          <body>
            <Main />
              <NextScript />
          </body>
      </html>
    );
  }
}

export default Page;
