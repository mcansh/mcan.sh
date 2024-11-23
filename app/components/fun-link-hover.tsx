import type { LinkProps } from "react-router";
import { Link } from "react-router";

export function FunHoverLink({ children, to, ...props }: LinkProps) {
	return (
		<Link
			className="from-link to-link fun-link-hover-gradient relative cursor-pointer bg-gradient-to-t bg-[100%_100%] bg-no-repeat text-center leading-6 font-thin no-underline transition-all duration-200 hover:text-white"
			to={to}
			{...props}
		>
			{children}
		</Link>
	);
}
