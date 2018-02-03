import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { injectGlobal } from 'styled-components';
import { fontFace } from '../style';

injectGlobal([
  `
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

  ${fontFace}
`
]);

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  max-width: 60rem;
  width: 90%;
  margin: 0 auto 5rem auto;
  background: #f3f4f6;
`;

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
    const { children } = this.props;
    return <Main>{children}</Main>;
  }
}

Page.propTypes = {
  children: PropTypes.node.isRequired
};

export default Page;
