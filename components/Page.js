import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Raven from 'raven-js';
import { version } from '../package.json';
import { fontFace } from '../style';

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
            font-family: 'Gotham Pro', sans-serif;
            text-align: center;
          }
        `}</style>
        <style jsx global>
          {fontFace}
        </style>
      </main>
    );
  }
}

Page.propTypes = {
  children: PropTypes.node.isRequired
};

export default Page;
