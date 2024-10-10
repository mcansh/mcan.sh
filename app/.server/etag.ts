import { sha1 } from "@oslojs/crypto/sha1";

export async function createEtag(
	entity: Buffer | string,
	options: { weak?: boolean } = {},
): Promise<string> {
	let uint8Array =
		typeof entity === "string" ? new TextEncoder().encode(entity) : entity;

	let hash = sha1(uint8Array);

	let hashHex = Array.from(new Uint8Array(hash))
		.map((byte) => byte.toString(16).padStart(2, "0"))
		.join("");

	return options.weak ? `W/"${hashHex}"` : `"${hashHex}"`;
}
