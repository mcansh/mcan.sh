import type { useMatches } from "react-router";

export interface RouteHandle {
	bodyClassName?: string;
}

export type Match = Omit<ReturnType<typeof useMatches>, "handle"> & {
	handle?: RouteHandle;
};
