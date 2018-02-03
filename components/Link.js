import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from 'styled-components';
import { colors } from '../style';

const Anchor = styled.a`
  position: relative;
  text-decoration: none;
  color: ${colors.primary};

  &:hover {
    text-decoration: underline;
    text-decoration-skip-ink: auto;
  }
`;

const CustomLink = ({ href, children }) => {
  const external = href.startsWith('http://') || href.startsWith('https://');
  if (external) {
    return (
      <Link href={href}>
        <Anchor rel="noopener" target="_blank">
          {children}
        </Anchor>
      </Link>
    );
  }
  return (
    <Link href={href} prefetch>
      <Anchor>{children}</Anchor>
    </Link>
  );
};

CustomLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default CustomLink;
