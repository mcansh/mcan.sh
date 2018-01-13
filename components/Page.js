import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Raven from 'raven-js';
import { version } from '../package.json';

class Page extends Component {
  componentDidMount() {
    if (process.env.NODE_ENV === 'production') {
      if (process.env.SENTRY) {
        Raven.config(process.env.SENTRY, {
          release: version,
          environment: process.env.NODE_ENV
        }).install();
      }

      /* eslint-disable no-console */
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/sw.js')
          .then(console.log('service worker registration successful'))
          .catch(err => console.warn(err));
      }
      /* eslint-enable no-console */
    }
  }
  render() {
    const { children } = this.props;
    return (
      <main>
        {children}
        <style jsx>{`
          main {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            min-height: 100vh;
            max-width: 60rem;
            width: 90%;
            margin: 0 auto 5rem auto;
            background: #f3f4f6;
          }
        `}</style>
        <style jsx global>{`
          *,
          *::before,
          *::after {
            box-sizing: border-box;
            margin: 0;
          }

          html {
            font-size: 10px;
          }

          body {
            line-height: 1.3;
            background: #f3f4f6;
            font-family: 'gotham pro', sans-serif;
          }

          @font-face {
            font-family: 'Gotham Pro';
            src: url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Bold.eot');
            src: url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Bold.eot?#iefix')
                format('embedded-opentype'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Bold.woff2')
                format('woff2'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Bold.woff')
                format('woff'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Bold.ttf')
                format('truetype'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Bold.svg#GothamPro-Bold')
                format('svg');
            font-weight: bold;
            font-style: normal;
          }

          @font-face {
            font-family: 'Gotham Pro';
            src: url('https://mcan.sh/assets/fonts/Gotham/GothamPro.eot');
            src: url('https://mcan.sh/assets/fonts/Gotham/GothamPro.eot?#iefix')
                format('embedded-opentype'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro.woff2')
                format('woff2'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro.woff')
                format('woff'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro.ttf')
                format('truetype'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro.svg#GothamPro')
                format('svg');
            font-weight: normal;
            font-style: normal;
          }

          @font-face {
            font-family: 'Gotham Pro';
            src: url('https://mcan.sh/assets/fonts/Gotham/GothamPro-BlackItalic.eot');
            src: url('https://mcan.sh/assets/fonts/Gotham/GothamPro-BlackItalic.eot?#iefix')
                format('embedded-opentype'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-BlackItalic.woff2')
                format('woff2'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-BlackItalic.woff')
                format('woff'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-BlackItalic.ttf')
                format('truetype'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-BlackItalic.svg#GothamPro-BlackItalic')
                format('svg');
            font-weight: 900;
            font-style: italic;
          }

          @font-face {
            font-family: 'Gotham Pro Narrow';
            src: url('https://mcan.sh/assets/fonts/Gotham/GothamProNarrow-Bold.eot');
            src: url('https://mcan.sh/assets/fonts/Gotham/GothamProNarrow-Bold.eot?#iefix')
                format('embedded-opentype'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamProNarrow-Bold.woff2')
                format('woff2'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamProNarrow-Bold.woff')
                format('woff'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamProNarrow-Bold.ttf')
                format('truetype'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamProNarrow-Bold.svg#GothamProNarrow-Bold')
                format('svg');
            font-weight: bold;
            font-style: normal;
          }

          @font-face {
            font-family: 'Gotham Pro';
            src: url('https://mcan.sh/assets/fonts/Gotham/GothamPro-BoldItalic.eot');
            src: url('https://mcan.sh/assets/fonts/Gotham/GothamPro-BoldItalic.eot?#iefix')
                format('embedded-opentype'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-BoldItalic.woff2')
                format('woff2'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-BoldItalic.woff')
                format('woff'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-BoldItalic.ttf')
                format('truetype'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-BoldItalic.svg#GothamPro-BoldItalic')
                format('svg');
            font-weight: bold;
            font-style: italic;
          }

          @font-face {
            font-family: 'Gotham Pro Narrow';
            src: url('https://mcan.sh/assets/fonts/Gotham/GothamProNarrow-Medium.eot');
            src: url('https://mcan.sh/assets/fonts/Gotham/GothamProNarrow-Medium.eot?#iefix')
                format('embedded-opentype'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamProNarrow-Medium.woff2')
                format('woff2'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamProNarrow-Medium.woff')
                format('woff'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamProNarrow-Medium.ttf')
                format('truetype'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamProNarrow-Medium.svg#GothamProNarrow-Medium')
                format('svg');
            font-weight: 500;
            font-style: normal;
          }

          @font-face {
            font-family: 'Gotham Pro';
            src: url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Italic.eot');
            src: url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Italic.eot?#iefix')
                format('embedded-opentype'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Italic.woff2')
                format('woff2'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Italic.woff')
                format('woff'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Italic.ttf')
                format('truetype'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Italic.svg#GothamPro-Italic')
                format('svg');
            font-weight: normal;
            font-style: italic;
          }

          @font-face {
            font-family: 'Gotham Pro';
            src: url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Light.eot');
            src: url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Light.eot?#iefix')
                format('embedded-opentype'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Light.woff2')
                format('woff2'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Light.woff')
                format('woff'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Light.ttf')
                format('truetype'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Light.svg#GothamPro-Light')
                format('svg');
            font-weight: 300;
            font-style: normal;
          }

          @font-face {
            font-family: 'Gotham Pro';
            src: url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Black.eot');
            src: url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Black.eot?#iefix')
                format('embedded-opentype'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Black.woff2')
                format('woff2'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Black.woff')
                format('woff'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Black.ttf')
                format('truetype'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Black.svg#GothamPro-Black')
                format('svg');
            font-weight: 900;
            font-style: normal;
          }

          @font-face {
            font-family: 'Gotham Pro';
            src: url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Medium.eot');
            src: url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Medium.eot?#iefix')
                format('embedded-opentype'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Medium.woff2')
                format('woff2'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Medium.woff')
                format('woff'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Medium.ttf')
                format('truetype'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-Medium.svg#GothamPro-Medium')
                format('svg');
            font-weight: 500;
            font-style: normal;
          }

          @font-face {
            font-family: 'Gotham Pro';
            src: url('https://mcan.sh/assets/fonts/Gotham/GothamPro-LightItalic.eot');
            src: url('https://mcan.sh/assets/fonts/Gotham/GothamPro-LightItalic.eot?#iefix')
                format('embedded-opentype'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-LightItalic.woff2')
                format('woff2'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-LightItalic.woff')
                format('woff'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-LightItalic.ttf')
                format('truetype'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-LightItalic.svg#GothamPro-LightItalic')
                format('svg');
            font-weight: 300;
            font-style: italic;
          }

          @font-face {
            font-family: 'Gotham Pro';
            src: url('https://mcan.sh/assets/fonts/Gotham/GothamPro-MediumItalic.eot');
            src: url('https://mcan.sh/assets/fonts/Gotham/GothamPro-MediumItalic.eot?#iefix')
                format('embedded-opentype'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-MediumItalic.woff2')
                format('woff2'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-MediumItalic.woff')
                format('woff'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-MediumItalic.ttf')
                format('truetype'),
              url('https://mcan.sh/assets/fonts/Gotham/GothamPro-MediumItalic.svg#GothamPro-MediumItalic')
                format('svg');
            font-weight: 500;
            font-style: italic;
          }
        `}</style>
      </main>
    );
  }
}

Page.propTypes = {
  children: PropTypes.node.isRequired
};

export default Page;
