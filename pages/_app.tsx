import React from 'react';
import Head from 'next/head';
import App from 'next/app';
import { ThemeProvider } from 'styled-components';
import { LinkProvider } from '@mcansh/custom-next-link';

import { GlobalStyle } from '~/components/style/global-style';
import { version, repository, description } from '~/package.json';
import { theme } from '~/config';

const iconSizes = [32, 57, 72, 96, 120, 128, 144, 152, 195, 228];

if (typeof window !== 'undefined') {
  const info = [
    `Version: ${version}`,
    `Next.js Build: ${process.env.BUILD_ID}`,
    `You can find the code here: https://github.com/${repository}`,
  ];
  // eslint-disable-next-line no-console
  info.forEach(message => console.log(message));
}

class MyApp extends App {
  public render() {
    const { Component, pageProps } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <LinkProvider value="https://mcan.sh">
          <Head>
            <title>Logan McAnsh</title>
            <meta name="description" content={description} />
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width, viewport-fit=cover"
            />
            <link rel="mask-icon" href="/logo.svg" color="#0448f8" />
            {/* <link rel="manifest" key="manifest" href={manifest} /> */}
            {/* <meta name="theme-color" content={colors.primary} /> */}
            <meta
              name="apple-mobile-web-app-status-bar-style"
              content="black-translucent"
            />
            <link rel="icon" href="/favicon.png" />
            <link rel="icon" href="/favicon.ico" />
            {iconSizes.map(icon => {
              const size = `${icon}x${icon}`;
              return (
                <link
                  key={size}
                  rel="apple-touch-icon-precomposed"
                  sizes={size}
                  href={`/static/images/logo/logo-${icon}.png`}
                />
              );
            })}
          </Head>
          <GlobalStyle />
          <Component {...pageProps} />
        </LinkProvider>
      </ThemeProvider>
    );
  }
}

export default MyApp;
