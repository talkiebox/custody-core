package io.ellice.web.infrastructure.gateway;

import io.ellice.web.api.BalanceResponse;
import io.ellice.web.api.NonceResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class GatewayAccountsClient {

	private final RestClient gatewayRestClient;

	public GatewayAccountsClient(RestClient gatewayRestClient) {
		this.gatewayRestClient = gatewayRestClient;
	}

	public BalanceResponse getBalance(String address) {
		return gatewayRestClient.get()
				.uri("/accounts/{address}/balance", address)
				.retrieve()
				.body(BalanceResponse.class);
	}

	public NonceResponse getNonce(String address) {
		return gatewayRestClient.get()
				.uri("/accounts/{address}/nonce", address)
				.retrieve()
				.body(NonceResponse.class);
	}
}
