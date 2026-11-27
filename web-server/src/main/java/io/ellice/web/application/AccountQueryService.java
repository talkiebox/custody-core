package io.ellice.web.application;

import io.ellice.web.api.BalanceResponse;
import io.ellice.web.api.NonceResponse;
import io.ellice.web.infrastructure.gateway.GatewayAccountsClient;
import org.springframework.stereotype.Service;

@Service
public class AccountQueryService {

	private final GatewayAccountsClient gatewayAccountsClient;

	public AccountQueryService(GatewayAccountsClient gatewayAccountsClient) {
		this.gatewayAccountsClient = gatewayAccountsClient;
	}

	public BalanceResponse getBalance(String address) {
		return gatewayAccountsClient.getBalance(address);
	}

	public NonceResponse getNonce(String address) {
		return gatewayAccountsClient.getNonce(address);
	}
}
