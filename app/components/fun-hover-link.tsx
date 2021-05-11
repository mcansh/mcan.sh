import * as React from 'react';

import styles from '../styles/fun-hover-link.css';

type Props = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

interface FunctionComponentStyles<P> extends React.FC<P> {
  styles: string;
}

const FunHoverLink: FunctionComponentStyles<Props> = ({
  children,
  ...rest
}) => (
  <a {...rest} className="fun-link">
    {children}
  </a>
);

FunHoverLink.styles = styles;

export { FunHoverLink };
