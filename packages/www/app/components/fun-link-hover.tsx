import * as Remix from "remix/component"

type LinkProps = Remix.Props<"a"> & {
	href: string
}

export function FunHoverLink() {
	return ({ children, href, ...props }: LinkProps) => {
		return (
			<a
				{...props}
				href={href}
				className="from-link to-link fun-link-hover-gradient relative cursor-pointer bg-gradient-to-t bg-[100%_100%] bg-no-repeat text-center leading-6 font-thin no-underline transition-all duration-200 hover:text-white"
			>
				{children}
			</a>
		)
	}
}
