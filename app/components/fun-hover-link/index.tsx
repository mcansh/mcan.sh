import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";

import "./fun-hover-link.css";

export function FunHoverLink({ children, to, ...props }: LinkProps) {
	return (
		<Link
			{...props}
			className="fun-link relative bg-no-repeat no-underline hover:text-white"
			to={to}
		>
			{children}
		</Link>
	);
}