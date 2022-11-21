import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";

function FunHoverLink({ children, to, ...rest }: LinkProps) {
  let href = to.toString();
  let isExternal = /^https?:\/\//.test(href);

  if (isExternal) {
    return (
      <a
        {...rest}
        className="fun-link relative bg-no-repeat text-current no-underline"
        href={href}
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      {...rest}
      className="fun-link relative bg-no-repeat text-current no-underline"
      to={href}
    >
      {children}
    </Link>
  );
}

export { default as styles } from "~/styles/fun-hover-link.css";
export { FunHoverLink };
