import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Raven from 'raven-js';
import { version } from '../package.json';

const fontPath = 'https://mcan.sh/assets/fonts/Gotham';
const fonts = [
  { name: 'GothamPro', weight: 'normal', style: 'normal' },
  { name: 'GothamPro-LightItalic', weight: '300', style: 'italic' },
  { name: 'GothamPro-MediumItalic', weight: '500', style: 'italic' },
  { name: 'GothamPro-BlackItalic', weight: '900', style: 'italic' },
  { name: 'GothamPro-BoldItalic', weight: 'bold', style: 'italic' },
  { name: 'GothamPro-Light', weight: '300', style: 'normal' },
  { name: 'GothamPro-Bold', weight: 'bold', style: 'normal' },
  { name: 'GothamPro-Black', weight: '900', style: 'normal' },
  { name: 'GothamPro-Medium', weight: '500', style: 'normal' },
  { name: 'GothamPro-Italic', weight: 'normal', style: 'italic' }
];

const fontFace = fonts.map(
  font => `@font-face {
		font-family: 'Gotham Pro';
		src: url('${fontPath}/${font}.eot');
		src: url('${fontPath}/${font}.eot?#iefix') format('embedded-opentype'),
         url('${fontPath}/${font}.woff2') format('woff2'),
			   url('${fontPath}/${font}.woff') format('woff'),
			   url('${fontPath}/${font}.ttf') format('truetype'),
			   url('${fontPath}/${font}.svg#GothamPro-Bold') format('svg');
		font-weight: normal;
		font-style: normal;
	}`
);

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
            text-align: center;
          }

          ${fontFace.join('')};
        `}</style>
      </main>
    );
  }
}

Page.propTypes = {
  children: PropTypes.node.isRequired
};

export default Page;
