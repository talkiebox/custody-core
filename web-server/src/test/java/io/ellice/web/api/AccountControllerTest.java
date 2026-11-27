package io.ellice.web.api;

import io.ellice.web.application.AccountQueryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AccountController.class)
class AccountControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private AccountQueryService accountQueryService;

	@Test
	void getBalanceReturnsBalanceFromService() throws Exception {
		String address = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
		when(accountQueryService.getBalance(address))
				.thenReturn(new BalanceResponse(address, "1000000000000000000", "1.0", "ETH", "11155111"));

		mockMvc.perform(get("/api/v1/accounts/{address}/balance", address))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.address").value(address))
				.andExpect(jsonPath("$.balanceWei").value("1000000000000000000"))
				.andExpect(jsonPath("$.balance").value("1.0"))
				.andExpect(jsonPath("$.symbol").value("ETH"))
				.andExpect(jsonPath("$.chainId").value("11155111"));
	}

	@Test
	void getNonceReturnsNonceFromService() throws Exception {
		String address = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
		when(accountQueryService.getNonce(address))
				.thenReturn(new NonceResponse(address, 7, "pending", "11155111"));

		mockMvc.perform(get("/api/v1/accounts/{address}/nonce", address))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.address").value(address))
				.andExpect(jsonPath("$.nonce").value(7))
				.andExpect(jsonPath("$.blockTag").value("pending"))
				.andExpect(jsonPath("$.chainId").value("11155111"));
	}

	@Test
	void getBalanceRejectsInvalidAddress() throws Exception {
		mockMvc.perform(get("/api/v1/accounts/{address}/balance", "not-an-address"))
				.andExpect(status().isBadRequest());

		verifyNoInteractions(accountQueryService);
	}
}
