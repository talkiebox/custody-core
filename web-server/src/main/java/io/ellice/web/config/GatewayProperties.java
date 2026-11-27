package io.ellice.web.config;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "gateway")
public record GatewayProperties(
		@NotBlank String scheme,
		@NotBlank String host,
		@Min(1) @Max(65535) int port,
		@NotBlank String apiPrefix
) {
	public String baseUrl() {
		String normalizedPrefix = apiPrefix.startsWith("/") ? apiPrefix : "/" + apiPrefix;
		return scheme + "://" + host + ":" + port + normalizedPrefix;
	}
}
