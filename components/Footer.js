import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'unistore/react';
import { actions } from '../store';

const StyledFooter = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -1;
  font-size: 1.6rem;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  color: ${props => props.theme[props.colors].text};
  background: ${props => props.theme[props.colors].background};
`;

const Text = styled.div`
  max-width: 60rem;
  width: 80%;
  margin: 0 auto;
  text-align: center;
  z-index: -1;
`;

const Footer = ({ dark }) => {
  const year = new Date().getFullYear();
  return (
    <StyledFooter colors={dark ? 'dark' : 'light'}>
      <Text>&copy; {year} Logan McAnsh</Text>
    </StyledFooter>
  );
};

Footer.propTypes = {
  dark: PropTypes.bool.isRequired,
};

export default connect('dark', actions)(Footer);
