import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const P = styled.p`
  font-size: 1.8rem;
  margin: 0;
`;

const Paragraph = ({ children }) => <Paragraph>{children}</Paragraph>;

Paragraph.propTypes = {
  children: PropTypes.node.isRequired
};

export default P;
