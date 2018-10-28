import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Heading = styled.h2`
  text-align: center;
  font-size: 4rem;
  font-weight: 400;
  margin: 2rem 0;
  max-width: 60rem;
  color: ${props => props.theme.text};
`;

const H2 = ({ children }) => <Heading>{children}</Heading>;

H2.propTypes = {
  children: PropTypes.node.isRequired,
};

export default H2;
