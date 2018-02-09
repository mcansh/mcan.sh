import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'unistore/react';
import { actions } from '../store';

const P = ({ children, dark }) => (
  <p>
    {children}
    <style jsx>{`
      p {
        font-size: 1.8rem;
        margin: 0;
        color: ${dark ? 'white' : 'black'};
      }
    `}</style>
  </p>
);

P.propTypes = {
  children: PropTypes.node.isRequired,
  dark: PropTypes.bool.isRequired,
};

export default connect('dark', actions)(P);
