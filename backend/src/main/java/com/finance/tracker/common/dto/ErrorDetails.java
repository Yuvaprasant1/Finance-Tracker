package com.finance.tracker.common.dto;

import com.finance.tracker.common.util.DateTimeUtils;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Error details for error responses
 * Wrapped in ApiResponse<ErrorDetails>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorDetails {
    private String error;
    private String message;
    private LocalDateTime timestamp;
    private String path;
    private Map<String, Object> details;
    
    public static ErrorDetails of(String error, String message) {
        return ErrorDetails.builder()
                .error(error)
                .message(message)
                .timestamp(DateTimeUtils.getCurrentDateTimeIST())
                .build();
    }
    
    public static ErrorDetails of(String error, String message, String path) {
        return ErrorDetails.builder()
                .error(error)
                .message(message)
                .timestamp(DateTimeUtils.getCurrentDateTimeIST())
                .path(path)
                .build();
    }
    
    public static ErrorDetails of(String error, String message, String path, Map<String, Object> details) {
        return ErrorDetails.builder()
                .error(error)
                .message(message)
                .timestamp(DateTimeUtils.getCurrentDateTimeIST())
                .path(path)
                .details(details)
                .build();
    }
}

