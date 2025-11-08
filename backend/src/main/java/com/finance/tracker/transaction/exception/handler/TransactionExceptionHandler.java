package com.finance.tracker.transaction.exception.handler;

import com.finance.tracker.common.dto.ApiResponse;
import com.finance.tracker.common.dto.ErrorDetails;
import com.finance.tracker.transaction.exception.TransactionAccessDeniedException;
import com.finance.tracker.transaction.exception.TransactionNotFoundException;
import com.finance.tracker.transaction.exception.TransactionValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

/**
 * Exception handler for Transaction package
 * Handles all transaction-related exceptions
 */
@RestControllerAdvice(basePackages = "com.finance.tracker.transaction")
public class TransactionExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(TransactionExceptionHandler.class);
    
    @ExceptionHandler(TransactionNotFoundException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleTransactionNotFoundException(
            TransactionNotFoundException ex, WebRequest request) {
        logger.warn("Transaction not found: {}", ex.getMessage());
        ErrorDetails errorDetails = ErrorDetails.of(
                ex.getErrorCode(),
                ex.getMessage(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(ex.getHttpStatus())
                .body(ApiResponse.error(errorDetails, ex.getHttpStatus()));
    }
    
    @ExceptionHandler(TransactionValidationException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleTransactionValidationException(
            TransactionValidationException ex, WebRequest request) {
        logger.warn("Transaction validation error: {}", ex.getMessage());
        ErrorDetails errorDetails = ErrorDetails.of(
                ex.getErrorCode(),
                ex.getMessage(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(ex.getHttpStatus())
                .body(ApiResponse.error(errorDetails, ex.getHttpStatus()));
    }
    
    @ExceptionHandler(TransactionAccessDeniedException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleTransactionAccessDeniedException(
            TransactionAccessDeniedException ex, WebRequest request) {
        logger.warn("Transaction access denied: {}", ex.getMessage());
        ErrorDetails errorDetails = ErrorDetails.of(
                ex.getErrorCode(),
                ex.getMessage(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(ex.getHttpStatus())
                .body(ApiResponse.error(errorDetails, ex.getHttpStatus()));
    }
}

