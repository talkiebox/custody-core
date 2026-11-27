package io.ellice.web.api;

import io.ellice.web.application.AccountQueryService;
import jakarta.validation.constraints.Pattern;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {

	private static final String EVM_ADDRESS_PATTERN = "^0x[a-fA-F0-9]{40}$";

	private final AccountQueryService accountQueryService;

	public AccountController(AccountQueryService accountQueryService) {
		this.accountQueryService = accountQueryService;
	}

	@GetMapping("/{address}/balance")
	public BalanceResponse getBalance(
			@PathVariable @Pattern(regexp = EVM_ADDRESS_PATTERN, message = "Invalid EVM address.") String address) {
		return accountQueryService.getBalance(address);
	}

	@GetMapping("/{address}/nonce")
	public NonceResponse getNonce(
			@PathVariable @Pattern(regexp = EVM_ADDRESS_PATTERN, message = "Invalid EVM address.") String address) {
		return accountQueryService.getNonce(address);
	}
}
