import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'unistore/react';
import { actions } from '../store';

const H2 = ({ children, dark }) => (
  <h2>
    {children}
    <style jsx>{`
      h2 {
        text-align: center;
        font-size: 4rem;
        font-weight: 400;
        margin: 2rem 0;
        color: ${dark ? 'white' : 'black'};
      }
    `}</style>
  </h2>
);

H2.propTypes = {
  children: PropTypes.node.isRequired,
  dark: PropTypes.bool.isRequired,
};

export default connect('dark', actions)(H2);
