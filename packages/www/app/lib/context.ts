import { getContext } from "remix/async-context-middleware"
import { createStorageKey } from "remix/fetch-router"

let NONCE_KEY = createStorageKey<string>()

/**
 * Get the current CSP nonce from app storage.
 */
export function getCSPNonce(): string {
	return getContext().storage.get(NONCE_KEY)
}

/**
 * Set the current CSP nonce in app storage.
 */
export function setCSPNonce(nonce: string): void {
	getContext().storage.set(NONCE_KEY, nonce)
}
