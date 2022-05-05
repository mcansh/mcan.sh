import * as React from 'react';

type Props = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

const FunHoverLink: React.FC<Props> = ({ children, ...rest }) => (
  <a {...rest} className="fun-link">
    {children}
  </a>
);

export { default as styles } from '~/styles/fun-hover-link.css';
export { FunHoverLink };
