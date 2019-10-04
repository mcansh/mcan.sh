import { UrlObject, format, parse } from 'url';

import React from 'react';
import NextLink, { LinkProps } from 'next/link';

function checkSameOrigin(url: UrlObject | string) {
  const href = typeof url === 'string' ? parse(url) : url;
  if (!href.protocol || !href.hostname) return true;
  if (!/^https?/.test(href.protocol)) return false;
  const domain =
    process.env.NODE_ENV === 'development' ? 'localhost:3000' : 'mcan.sh';
  return href.hostname === domain;
}

const Link: React.FC<LinkProps> = ({ children, href, ...props }) => {
  const isSameOrigin = checkSameOrigin(href);

  if (isSameOrigin) {
    return (
      <NextLink href={href} {...props}>
        {children}
      </NextLink>
    );
  }

  return (
    <>
      {React.Children.map(children, child => {
        const options = {
          href: typeof href === 'string' ? href : format(href),
          target: '_blank',
          rel: 'noopener external nofollow noreferrer',
        };

        return React.cloneElement(child as any, options);
      })}
    </>
  );
};

export { Link };
