import React from 'react';
import PropTypes from 'prop-types';

const H2 = props => (
  <h2>
    {props.children}
    <style jsx>{`
      h2 {
        text-align: center;
        font-size: 4rem;
        font-weight: 400;
        margin: 2rem 0;
      }
    `}</style>
  </h2>
);

H2.propTypes = {
  children: PropTypes.node.isRequired
};

export default H2;
