import React from 'react';
import PropTypes from 'prop-types';

const P = props => (
  <p>
    {props.children}
    <style jsx>{`
      p {
        font-size: 1.8rem;
        margin: 0;
      }
    `}</style>
  </p>
);

P.propTypes = {
  children: PropTypes.node.isRequired
};

export default P;
