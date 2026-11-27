package io.ellice.web.infrastructure.gateway;

import io.ellice.web.api.BalanceResponse;
import io.ellice.web.api.NonceResponse;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.http.HttpMethod.GET;

class GatewayAccountsClientTest {

	@Test
	void getBalanceCallsGatewayBalanceEndpoint() {
		RestClient.Builder builder = RestClient.builder().baseUrl("http://127.0.0.1:3001/api/v1");
		MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
		GatewayAccountsClient client = new GatewayAccountsClient(builder.build());
		String address = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";

		server.expect(requestTo("http://127.0.0.1:3001/api/v1/accounts/" + address + "/balance"))
				.andExpect(method(GET))
				.andRespond(withSuccess("""
						{
						  "address": "%s",
						  "balanceWei": "1000000000000000000",
						  "balance": "1.0",
						  "symbol": "ETH",
						  "chainId": "11155111"
						}
						""".formatted(address), MediaType.APPLICATION_JSON));

		BalanceResponse response = client.getBalance(address);

		assertThat(response.address()).isEqualTo(address);
		assertThat(response.balanceWei()).isEqualTo("1000000000000000000");
		assertThat(response.balance()).isEqualTo("1.0");
		assertThat(response.symbol()).isEqualTo("ETH");
		assertThat(response.chainId()).isEqualTo("11155111");
		server.verify();
	}

	@Test
	void getNonceCallsGatewayNonceEndpoint() {
		RestClient.Builder builder = RestClient.builder().baseUrl("http://127.0.0.1:3001/api/v1");
		MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
		GatewayAccountsClient client = new GatewayAccountsClient(builder.build());
		String address = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";

		server.expect(requestTo("http://127.0.0.1:3001/api/v1/accounts/" + address + "/nonce"))
				.andExpect(method(GET))
				.andRespond(withSuccess("""
						{
						  "address": "%s",
						  "nonce": 7,
						  "blockTag": "pending",
						  "chainId": "11155111"
						}
						""".formatted(address), MediaType.APPLICATION_JSON));

		NonceResponse response = client.getNonce(address);

		assertThat(response.address()).isEqualTo(address);
		assertThat(response.nonce()).isEqualTo(7);
		assertThat(response.blockTag()).isEqualTo("pending");
		assertThat(response.chainId()).isEqualTo("11155111");
		server.verify();
	}
}
