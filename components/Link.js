import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import style from '../style';

const CustomLink = ({ href, children }) => {
  const external = href.startsWith('http://') || href.startsWith('https://');
  if (external) {
    return (
      <Link href={href}>
        <a rel="noopener" target="_blank">
          {children}
          <style jsx>{`
            a {
              position: relative;
              text-decoration: none;
              color: ${style.primary};
            }

            a:hover {
              text-decoration: underline;
              text-decoration-skip-ink: auto;
            }
          `}</style>
        </a>
      </Link>
    );
  }
  return (
    <Link href={href} prefetch>
      <a>
        {children}
        <style jsx>{`
          a {
            position: relative;
            text-decoration: none;
            color: ${style.primary};
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
