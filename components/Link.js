import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'next/link';
import isAbsoluteUrl from 'is-absolute-url';
import { connect } from 'unistore/react';
import { actions } from '../store';

const StyledLink = styled.a`
  position: relative;
  text-decoration: none;
  color: ${props => props.theme[props.color].links};

  &:hover {
    text-decoration: underline;
    text-decoration-skip-ink: auto;
  }
`;

const CustomLink = ({ href, children, dark }) => {
  const isExternal = isAbsoluteUrl(href);
  return (
    <Link href={href} prefetch={!isExternal} passHref>
      <StyledLink
        color={dark ? 'dark' : 'light'}
        rel={isExternal ? 'noopener' : ''}
        target={isExternal ? '_blank' : ''}
      >
        {children}
      </StyledLink>
    </Link>
  );
};

CustomLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  dark: PropTypes.bool.isRequired,
};

export default connect('dark', actions)(CustomLink);
