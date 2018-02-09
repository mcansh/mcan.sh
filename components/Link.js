import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { connect } from 'unistore/react';
import { actions } from '../store';
import { colors } from '../style';

const CustomLink = ({ href, children, dark }) => {
  const isExternal = /^https?:\/\//.test(href);
  return (
    <Link href={href} prefetch={!isExternal}>
      <a rel={isExternal ? 'noopener' : ''} target={isExternal ? '_blank' : ''}>
        {children}
        <style jsx>{`
          a {
            position: relative;
            text-decoration: none;
            color: ${dark ? colors.primaryInDarkMode : colors.primary};
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
  children: PropTypes.node.isRequired,
};

export default connect('dark', actions)(CustomLink);
