import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { colors } from '../style';
import isExternal from '../lib/isExternal';

const CustomLink = ({ href, children }) => {
  const internalURL = !isExternal(href);
  return (
    <Link href={href} prefetch={internalURL}>
      <a
        rel={internalURL ? '' : 'noopener'}
        target={internalURL ? '' : '_blank'}
      >
        {children}
        <style jsx>{`
          a {
            position: relative;
            text-decoration: none;
            color: ${colors.primary};
          }

          a:hover {
            text-decoration: underline;
            text-decoration-skip-ink: auto;
          }
        `}</style>
      </a>
    </Link>
  );
};

CustomLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default CustomLink;
