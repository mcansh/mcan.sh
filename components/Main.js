import React from 'react';
import PropTypes from 'prop-types';

const Main = props => (
  <main>
    {props.children}
    <style jsx>{`
      main {
        background-color: inherit;
        z-index: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        min-height: 100vh;
        max-width: 600px;
        width: 80%;
        margin: 0 auto 50px auto;
        background: #F3F4F6;
      }
    `}</style>
  </main>
);

Main.propTypes = {
  children: PropTypes.node.isRequired
};

export default Main;
