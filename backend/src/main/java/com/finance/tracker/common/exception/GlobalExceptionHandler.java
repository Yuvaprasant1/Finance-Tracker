package com.finance.tracker.common.exception;

import com.finance.tracker.common.dto.ApiResponse;
import com.finance.tracker.common.dto.ErrorDetails;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Global exception handler for common exceptions and fallback
 * Package-specific handlers are in their respective packages
 * Returns standardized ApiResponse format for all errors
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    // Note: Package-specific exceptions are handled by their respective handlers:
    // - ExpenseExceptionHandler (expense package)
    // - UserExceptionHandler (user package)
    // - DashboardExceptionHandler (dashboard package)
    // - CurrencyExceptionHandler (currency package)
    // This handler only handles common Spring exceptions and fallback
    
    // Handle Spring validation exceptions
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleValidationExceptions(
            MethodArgumentNotValidException ex, WebRequest request) {
        Map<String, Object> details = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            details.put(fieldName, errorMessage);
        });
        
        ErrorDetails errorDetails = ErrorDetails.of(
                "VALIDATION_ERROR",
                "Validation failed",
                request.getDescription(false).replace("uri=", ""),
                details
        );
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(errorDetails, HttpStatus.BAD_REQUEST));
    }
    
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleConstraintViolationException(
            ConstraintViolationException ex, WebRequest request) {
        Map<String, Object> details = ex.getConstraintViolations().stream()
                .collect(Collectors.toMap(
                        violation -> violation.getPropertyPath().toString(),
                        ConstraintViolation::getMessage
                ));
        
        ErrorDetails errorDetails = ErrorDetails.of(
                "VALIDATION_ERROR",
                "Constraint validation failed",
                request.getDescription(false).replace("uri=", ""),
                details
        );
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(errorDetails, HttpStatus.BAD_REQUEST));
    }
    
    // Handle generic exceptions
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleGenericException(
            Exception ex, WebRequest request) {
        logger.error("Unexpected error occurred: {}", ex.getMessage(), ex);
        ErrorDetails errorDetails = ErrorDetails.of(
                "INTERNAL_SERVER_ERROR",
                "An unexpected error occurred",
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR));
    }
}

