import * as React from 'react';

type Props = React.HTMLAttributes<HTMLAnchorElement>;

const FunHoverLink: React.FC<Props> = ({ children, ...rest }) => (
  <a {...rest} className="fun-link">
    {children}
  </a>
);

export { FunHoverLink };
