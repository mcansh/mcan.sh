import React from 'react';
import Document, {
  Head,
  Main,
  NextScript,
  NextDocumentContext,
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';

class Page extends Document {
  static async getInitialProps(ctx: NextDocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    const { styles } = this.props;
    return (
      <html lang="en">
        <Head>{styles}</Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default Page;
