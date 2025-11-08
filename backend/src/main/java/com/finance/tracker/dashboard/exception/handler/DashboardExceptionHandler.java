package com.finance.tracker.dashboard.exception.handler;

import com.finance.tracker.common.dto.ApiResponse;
import com.finance.tracker.common.dto.ErrorDetails;
import com.finance.tracker.dashboard.exception.DashboardDataException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

/**
 * Exception handler for Dashboard package
 * Handles all dashboard-related exceptions
 */
@RestControllerAdvice(basePackages = "com.finance.tracker.dashboard")
public class DashboardExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(DashboardExceptionHandler.class);
    
    @ExceptionHandler(DashboardDataException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleDashboardDataException(
            DashboardDataException ex, WebRequest request) {
        logger.error("Dashboard data error: {}", ex.getMessage(), ex);
        ErrorDetails errorDetails = ErrorDetails.of(
                ex.getErrorCode(),
                ex.getMessage(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(ex.getHttpStatus())
                .body(ApiResponse.error(errorDetails, ex.getHttpStatus()));
    }
}

