import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { injectGlobal } from 'styled-components';
import { Provider, connect } from 'unistore/react';
import { store, actions } from '../store';
import { fontFace } from '../style';

injectGlobal`
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
    font-family: 'Gotham Pro', sans-serif;
    text-align: center;
    min-height: 100vh;
  }

  ${fontFace};
`;

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  max-width: 60rem;
  width: 100%;
  margin-bottom: 5rem;
  background: ${props => props.theme[props.backgroundColor].background};
`;

const App = connect('dark', actions)(({ dark, children }) => (
  <Main backgroundColor={dark ? 'dark' : 'light'}>{children}</Main>
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
