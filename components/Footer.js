import React from 'react';
import PropTypes from 'prop-types';

const Footer = props => (
  <footer>
    <div>
      {props.children}
    </div>
    <style jsx>{`
      footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: -1;
      }

      div {
        max-width: 600px;
        width: 80%;
        margin: 0 auto;
        text-align: center;
        z-index: -1;
      }
    `}</style>
  </footer>
);

Footer.propTypes = {
  children: PropTypes.node.isRequired
};

export default Footer;
