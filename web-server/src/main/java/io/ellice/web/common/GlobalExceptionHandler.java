package io.ellice.web.common;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestClientException;

import java.time.Instant;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<ApiErrorResponse> handleConstraintViolation(
			ConstraintViolationException exception,
			HttpServletRequest request) {
		return error(HttpStatus.BAD_REQUEST, exception.getMessage(), request);
	}

	@ExceptionHandler(RestClientResponseException.class)
	public ResponseEntity<ApiErrorResponse> handleGatewayResponse(
			RestClientResponseException exception,
			HttpServletRequest request) {
		HttpStatus status = HttpStatus.resolve(exception.getStatusCode().value());
		if (status == null) {
			status = HttpStatus.BAD_GATEWAY;
		}
		return error(status, "Gateway request failed.", request);
	}

	@ExceptionHandler(RestClientException.class)
	public ResponseEntity<ApiErrorResponse> handleGatewayUnavailable(
			RestClientException exception,
			HttpServletRequest request) {
		return error(HttpStatus.BAD_GATEWAY, "Gateway is unavailable.", request);
	}

	private ResponseEntity<ApiErrorResponse> error(HttpStatus status, String message, HttpServletRequest request) {
		return ResponseEntity.status(status)
				.body(new ApiErrorResponse(
						Instant.now(),
						status.value(),
						status.getReasonPhrase(),
						message,
						request.getRequestURI()));
	}
}
