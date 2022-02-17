import type { useMatches } from '@remix-run/react';

export interface RouteHandle {
  bodyClassName?: string;
}

export type Match = Omit<ReturnType<typeof useMatches>, 'handle'> & {
  handle?: RouteHandle;
};
