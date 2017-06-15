import React from 'react';
import PropTypes from 'prop-types';

const Headshot = props => (
  <div>
    {props.children}
    <style jsx>{`
      div {
        height: 150px;
        width: 150px;
        background-image: url(/static/images/11698668.jpg);
        background-size: cover;
        background-position: center;
        border-radius: 50%;
        margin: 0 auto;
      }
    `}</style>
  </div>
);

Headshot.propTypes = {
  children: PropTypes.node.isRequired
};

export default Headshot;
