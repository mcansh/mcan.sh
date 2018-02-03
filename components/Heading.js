import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Heading2 = styled.h2`
  text-align: center;
  font-size: 4rem;
  font-weight: 400;
  margin: 2rem 0;
`;

const H2 = props => <Heading2>{props.children}</Heading2>;

H2.propTypes = {
  children: PropTypes.node.isRequired
};

export default H2;
