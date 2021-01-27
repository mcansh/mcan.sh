import React from 'react';
import Document, { Html, Head, NextScript, Main } from 'next/document';

class MyDocument extends Document {
  public render() {
    return (
      <Html lang="en" className="h-full">
        <Head />
        <body className="h-full bg-white dark:bg-gray-800 dark:text-white">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
