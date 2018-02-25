import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

class Page extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <title>Logan McAnsh</title>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width, viewport-fit=cover"
          />
          <link rel="shortcut icon" href="/static/images/favicon.png" />
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
