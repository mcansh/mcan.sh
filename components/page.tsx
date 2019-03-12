import React, { useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { MDXProvider } from '@mdx-js/tag';
import Text from '~/components/text';
import H1 from '~/components/heading';
import Link from '~/components/link';
import Footer from '~/components/footer';
import Head from 'next/head';
import GlobalStyle from './global-style';
import { theme } from '~/style';

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const serviceWorker = async () => {
  if (
    process.env.NODE_ENV === 'production' &&
    'serviceWorker' in window.navigator
  ) {
    try {
      await window.navigator.serviceWorker.register('/sw.js');
      console.log('service worker registration successful');
    } catch (error) {
      console.warn(error);
    }
  }
};

const Page = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    serviceWorker();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <MDXProvider components={{ p: Text, h1: H1, a: Link }}>
        <Head>
          <title>Logan McAnsh</title>
          <meta name="description" content={process.env.DESCRIPTION} />
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width, viewport-fit=cover"
          />
          <link rel="shortcut icon" href="/static/images/favicon.png" />
          <link rel="stylesheet" href="/static/font.css" />
          <link rel="preload" as="style" href="/static/font.css" />
        </Head>
        <GlobalStyle />
        <Main>{children}</Main>
        <Footer />
      </MDXProvider>
    </ThemeProvider>
  );
};

export default Page;
