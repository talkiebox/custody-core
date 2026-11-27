package io.ellice.web.api;

public record NonceResponse(
		String address,
		long nonce,
		String blockTag,
		String chainId
) {
}
