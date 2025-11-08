package com.finance.tracker.user.exception.handler;

import com.finance.tracker.common.dto.ApiResponse;
import com.finance.tracker.common.dto.ErrorDetails;
import com.finance.tracker.user.exception.CurrencyEditNotAllowedException;
import com.finance.tracker.user.exception.UserAlreadyExistsException;
import com.finance.tracker.user.exception.UserNotFoundException;
import com.finance.tracker.user.exception.UserProfileAlreadyExistsException;
import com.finance.tracker.user.exception.UserProfileNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

/**
 * Exception handler for User package
 * Handles all user-related exceptions
 */
@RestControllerAdvice(basePackages = "com.finance.tracker.user")
public class UserExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(UserExceptionHandler.class);
    
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleUserNotFoundException(
            UserNotFoundException ex, WebRequest request) {
        logger.warn("User not found: {}", ex.getMessage());
        ErrorDetails errorDetails = ErrorDetails.of(
                ex.getErrorCode(),
                ex.getMessage(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(ex.getHttpStatus())
                .body(ApiResponse.error(errorDetails, ex.getHttpStatus()));
    }
    
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleUserAlreadyExistsException(
            UserAlreadyExistsException ex, WebRequest request) {
        logger.warn("User already exists: {}", ex.getMessage());
        ErrorDetails errorDetails = ErrorDetails.of(
                ex.getErrorCode(),
                ex.getMessage(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(ex.getHttpStatus())
                .body(ApiResponse.error(errorDetails, ex.getHttpStatus()));
    }
    
    @ExceptionHandler(UserProfileNotFoundException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleUserProfileNotFoundException(
            UserProfileNotFoundException ex, WebRequest request) {
        logger.warn("User profile not found: {}", ex.getMessage());
        ErrorDetails errorDetails = ErrorDetails.of(
                ex.getErrorCode(),
                ex.getMessage(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(ex.getHttpStatus())
                .body(ApiResponse.error(errorDetails, ex.getHttpStatus()));
    }
    
    @ExceptionHandler(CurrencyEditNotAllowedException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleCurrencyEditNotAllowedException(
            CurrencyEditNotAllowedException ex, WebRequest request) {
        logger.warn("Currency edit not allowed: {}", ex.getMessage());
        ErrorDetails errorDetails = ErrorDetails.of(
                ex.getErrorCode(),
                ex.getMessage(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(ex.getHttpStatus())
                .body(ApiResponse.error(errorDetails, ex.getHttpStatus()));
    }
    
    @ExceptionHandler(UserProfileAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleUserProfileAlreadyExistsException(
            UserProfileAlreadyExistsException ex, WebRequest request) {
        logger.warn("User profile already exists: {}", ex.getMessage());
        ErrorDetails errorDetails = ErrorDetails.of(
                ex.getErrorCode(),
                ex.getMessage(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(ex.getHttpStatus())
                .body(ApiResponse.error(errorDetails, ex.getHttpStatus()));
    }
}

