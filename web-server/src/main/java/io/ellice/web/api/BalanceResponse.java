package io.ellice.web.api;

public record BalanceResponse(
		String address,
		String balanceWei,
		String balance,
		String symbol,
		String chainId
) {
}
