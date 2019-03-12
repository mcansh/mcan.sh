import React from 'react';
import styled from 'styled-components';
import Link, { LinkProps } from 'next/link';
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

interface Props extends Omit<LinkProps, 'children'> {
  children: React.ReactNode;
}

const CustomLink = ({ href, children }: Props) => {
  const isExternal = isAbsoluteUrl(href.toString());
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

export default CustomLink;
