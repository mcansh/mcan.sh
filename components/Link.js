import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from 'styled-components';
import { colors } from '../style';
import isExternal from '../lib/isExternal';

const Anchor = styled(Link)`
  position: relative;
  text-decoration: none;
  color: ${colors.primary};

  &:hover {
    text-decoration: underline;
    text-decoration-skip-ink: auto;
  }
`;

const CustomLink = ({ href, children }) => {
  const external = isExternal(href);
  if (external) {
    return (
      <Anchor href={href} rel="noopener" target="_blank">
        {children}
      </Anchor>
    );
  }
  return (
    <Anchor href={href} prefetch>
      {children}
    </Anchor>
  );
};

CustomLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default CustomLink;
