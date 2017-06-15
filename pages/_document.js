import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  static async getInitialProps({ renderPage }) {
    const page = renderPage();
    return { ...page };
  }

  render() {
    return (
      <html lang="en">
        <Head>
          <title>Logan McAnsh</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <link rel="shortcut icon" href="/static/images/favicon.png" />
          <link rel="stylesheet" href="/static/css/style.css" />
        </Head>
        <body>
          <Main />
          <div>
            <NextScript />
          </div>
          <script src="/static/js/main.js" />
        </body>
      </html>
    );
  }
}
