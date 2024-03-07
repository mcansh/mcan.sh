import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";

export function FunHoverLink({ children, to, ...props }: LinkProps) {
	return (
		<Link
			className="from-link to-link relative cursor-pointer bg-gradient-to-t bg-[100%_100%] bg-[length:100%_2px] bg-no-repeat text-center font-thin leading-6 no-underline transition-all duration-200 hover:bg-[length:100%_100%] hover:text-white"
			to={to}
			{...props}
		>
			{children}
		</Link>
	);
}
