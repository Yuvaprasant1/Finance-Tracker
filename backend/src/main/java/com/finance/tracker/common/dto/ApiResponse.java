package com.finance.tracker.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

/**
 * Standardized API Response Wrapper
 * All API responses follow this format:
 * {
 *   "data": { ... },
 *   "status": 200
 * }
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private T data;
    private Integer status;
    
    /**
     * Create a successful response
     */
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .data(data)
                .status(HttpStatus.OK.value())
                .build();
    }
    
    /**
     * Create a successful response with custom status
     */
    public static <T> ApiResponse<T> success(T data, HttpStatus status) {
        return ApiResponse.<T>builder()
                .data(data)
                .status(status.value())
                .build();
    }
    
    /**
     * Create an error response
     */
    public static <T> ApiResponse<T> error(T errorData, HttpStatus status) {
        return ApiResponse.<T>builder()
                .data(errorData)
                .status(status.value())
                .build();
    }
}

