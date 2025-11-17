package com.finance.tracker.category.exception.handler;

import com.finance.tracker.category.exception.CategoryAccessDeniedException;
import com.finance.tracker.category.exception.CategoryNotFoundException;
import com.finance.tracker.category.exception.CategoryValidationException;
import com.finance.tracker.common.dto.ApiResponse;
import com.finance.tracker.common.dto.ErrorDetails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

/**
 * Exception handler for Category package
 * Handles all category-related exceptions
 */
@RestControllerAdvice(basePackages = "com.finance.tracker.category")
public class CategoryExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(CategoryExceptionHandler.class);
    
    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleCategoryNotFoundException(
            CategoryNotFoundException ex, WebRequest request) {
        logger.warn("Category not found: {}", ex.getMessage());
        ErrorDetails errorDetails = ErrorDetails.of(
                ex.getErrorCode(),
                ex.getMessage(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(ex.getHttpStatus())
                .body(ApiResponse.error(errorDetails, ex.getHttpStatus()));
    }
    
    @ExceptionHandler(CategoryValidationException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleCategoryValidationException(
            CategoryValidationException ex, WebRequest request) {
        logger.warn("Category validation error: {}", ex.getMessage());
        ErrorDetails errorDetails = ErrorDetails.of(
                ex.getErrorCode(),
                ex.getMessage(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(ex.getHttpStatus())
                .body(ApiResponse.error(errorDetails, ex.getHttpStatus()));
    }
    
    @ExceptionHandler(CategoryAccessDeniedException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleCategoryAccessDeniedException(
            CategoryAccessDeniedException ex, WebRequest request) {
        logger.warn("Category access denied: {}", ex.getMessage());
        ErrorDetails errorDetails = ErrorDetails.of(
                ex.getErrorCode(),
                ex.getMessage(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(ex.getHttpStatus())
                .body(ApiResponse.error(errorDetails, ex.getHttpStatus()));
    }
}

