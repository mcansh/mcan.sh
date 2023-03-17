import * as React from "react";
import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";

export { default as styles } from "~/styles/fun-hover-link.css";

export function FunHoverLink({ children, to, ...props }: LinkProps) {
  return (
    <Link
      {...props}
      className="fun-link relative bg-no-repeat text-current no-underline"
      to={to}
    >
      {children}
    </Link>
  );
}
