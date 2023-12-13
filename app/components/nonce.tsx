import * as React from "react";

let NonceContext = React.createContext<string | undefined>(undefined);

type NonceProviderProps = {
	nonce: string;
	children: React.ReactNode;
};

export function NonceProvider({ children, nonce }: NonceProviderProps) {
	return (
		<NonceContext.Provider value={nonce}>{children}</NonceContext.Provider>
	);
}

export function useNonce() {
	return React.useContext(NonceContext);
}
