import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider, connect } from 'unistore/react';
import { store, actions } from '../store';
import { fontFace } from '../style';

const App = connect('dark', actions)(({ dark, children }) => (
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
        background: ${dark ? 'black' : '#f3f4f6'};
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
        touch-action: manipulation;
      }

      body {
        line-height: 1.3;
        background: ${dark ? 'black' : '#f3f4f6'};
        font-family: 'Gotham Pro', sans-serif;
        text-align: center;
      }
    `}</style>
    <style jsx global>
      {fontFace}
    </style>
  </main>
));

class Page extends Component {
  componentDidMount() {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      /* eslint-disable no-console */
      navigator.serviceWorker
        .register('/sw.js')
        .then(console.log('service worker registration successful'))
        .catch(err => console.warn(err));
      /* eslint-enable no-console */
    }
  }
  render() {
    return (
      <Provider store={store}>
        <App {...this.props} />
      </Provider>
    );
  }
}

Page.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Page;
