import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'next/link';
import isAbsoluteUrl from 'is-absolute-url';

const StyledLink = styled.a`
  position: relative;
  text-decoration: none;
  color: ${props => props.theme.links};

  &:hover {
    text-decoration: underline;
    text-decoration-skip-ink: auto;
  }
`;

const CustomLink = ({ href, children }) => {
  const isExternal = isAbsoluteUrl(href);
  return (
    <Link href={href} prefetch={!isExternal} passHref>
      <StyledLink
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
};

export default CustomLink;
