package com.finance.tracker.currency.exception.handler;

import com.finance.tracker.common.dto.ApiResponse;
import com.finance.tracker.common.dto.ErrorDetails;
import com.finance.tracker.currency.exception.CurrencyNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

/**
 * Exception handler for Currency package
 * Handles all currency-related exceptions
 */
@RestControllerAdvice(basePackages = "com.finance.tracker.currency")
public class CurrencyExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(CurrencyExceptionHandler.class);
    
    @ExceptionHandler(CurrencyNotFoundException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleCurrencyNotFoundException(
            CurrencyNotFoundException ex, WebRequest request) {
        logger.warn("Currency not found: {}", ex.getMessage());
        ErrorDetails errorDetails = ErrorDetails.of(
                ex.getErrorCode(),
                ex.getMessage(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(ex.getHttpStatus())
                .body(ApiResponse.error(errorDetails, ex.getHttpStatus()));
    }
}

