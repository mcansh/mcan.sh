import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'unistore/react';
import { actions } from '../store';

const Text = styled.p`
  font-size: 1.8rem;
  margin: 0;
  color: ${props => props.theme[props.textColor].text};
  max-width: 60rem;
`;

const P = ({ children, dark }) => (
  <Text textColor={dark ? 'dark' : 'light'}>{children}</Text>
);

P.propTypes = {
  children: PropTypes.node.isRequired,
  dark: PropTypes.bool.isRequired,
};

export default connect('dark', actions)(P);
