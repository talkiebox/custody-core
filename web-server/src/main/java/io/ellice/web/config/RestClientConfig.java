package io.ellice.web.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

	@Bean
	RestClient gatewayRestClient(RestClient.Builder builder, GatewayProperties gatewayProperties) {
		return builder
				.baseUrl(gatewayProperties.baseUrl())
				.build();
	}
}
