import * as React from "react";
import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";

export { default as styles } from "~/styles/fun-hover-link.css";

export function FunHoverLink({
  children,
  to,
  prefetch = "none",
  ...props
}: LinkProps) {
  let href = to.toString();
  let isExternal = /^[a-z]+:/.test(href);
  let [shouldPrefetch, prefetchHandlers] = usePrefetchBehavior(prefetch, props);

  if (isExternal) {
    return (
      <>
        <a
          {...props}
          className="fun-link relative bg-no-repeat text-current no-underline"
          href={href}
          {...prefetchHandlers}
        >
          {children}
        </a>
        {shouldPrefetch ? (
          <link rel="prefetch" as="document" href={href} />
        ) : null}
      </>
    );
  }
  return (
    <Link
      {...props}
      className="fun-link relative bg-no-repeat text-current no-underline"
      to={href}
    >
      {children}
    </Link>
  );
}

interface PrefetchHandlers {
  onFocus?: React.FocusEventHandler<Element>;
  onBlur?: React.FocusEventHandler<Element>;
  onMouseEnter?: React.MouseEventHandler<Element>;
  onMouseLeave?: React.MouseEventHandler<Element>;
  onTouchStart?: React.TouchEventHandler<Element>;
}

type PrefetchBehavior = "intent" | "render" | "none";

function usePrefetchBehavior(
  prefetch: PrefetchBehavior,
  theirElementProps: PrefetchHandlers
): [boolean, Required<PrefetchHandlers>] {
  let [maybePrefetch, setMaybePrefetch] = React.useState(false);
  let [shouldPrefetch, setShouldPrefetch] = React.useState(false);
  let { onFocus, onBlur, onMouseEnter, onMouseLeave, onTouchStart } =
    theirElementProps;

  React.useEffect(() => {
    if (prefetch === "render") {
      setShouldPrefetch(true);
    }
  }, [prefetch]);

  let setIntent = () => {
    if (prefetch === "intent") {
      setMaybePrefetch(true);
    }
  };

  let cancelIntent = () => {
    if (prefetch === "intent") {
      setMaybePrefetch(false);
      setShouldPrefetch(false);
    }
  };

  React.useEffect(() => {
    if (maybePrefetch) {
      let id = setTimeout(() => {
        setShouldPrefetch(true);
      }, 100);
      return () => {
        clearTimeout(id);
      };
    }
  }, [maybePrefetch]);

  return [
    shouldPrefetch,
    {
      onFocus: composeEventHandlers(onFocus, setIntent),
      onBlur: composeEventHandlers(onBlur, cancelIntent),
      onMouseEnter: composeEventHandlers(onMouseEnter, setIntent),
      onMouseLeave: composeEventHandlers(onMouseLeave, cancelIntent),
      onTouchStart: composeEventHandlers(onTouchStart, setIntent),
    },
  ];
}

function composeEventHandlers<EventType extends React.SyntheticEvent | Event>(
  theirHandler: ((event: EventType) => any) | undefined,
  ourHandler: (event: EventType) => any
): (event: EventType) => any {
  return (event) => {
    theirHandler && theirHandler(event);
    if (!event.defaultPrevented) {
      ourHandler(event);
    }
  };
}
