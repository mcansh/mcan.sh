import React, { Component } from 'react';
import { node } from 'prop-types';
import styled from 'styled-components';

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
`;

class Page extends Component {
  static propTypes = {
    children: node.isRequired,
  };

  componentDidMount() {
    if (process.env.NODE_ENV === 'production') {
      if ('serviceWorker' in navigator) {
        /* eslint-disable no-console */
        navigator.serviceWorker
          .register('/sw.js')
          .then(console.log('service worker registration successful'))
          .catch(err => console.warn(err));
        /* eslint-enable no-console */
      }
    }
  }
  render() {
    return <Main>{this.props.children}</Main>;
  }
}

export default Page;
