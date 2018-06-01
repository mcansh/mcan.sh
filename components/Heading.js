import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'unistore/react';
import { actions } from '../store';

const Heading = styled.h2`
  text-align: center;
  font-size: 4rem;
  font-weight: 400;
  margin: 2rem 0;
  color: ${props => props.theme[props.textColor].text};
  max-width: 60rem;
`;

const H2 = ({ children, dark }) => (
  <Heading textColor={dark ? 'dark' : 'light'}>{children}</Heading>
);

H2.propTypes = {
  children: PropTypes.node.isRequired,
  dark: PropTypes.bool.isRequired,
};

export default connect('dark', actions)(H2);
