package com.finance.tracker.dashboard.exception;

import com.finance.tracker.common.exception.BaseException;
import org.springframework.http.HttpStatus;

public class DashboardDataException extends BaseException {
    public DashboardDataException(String message) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR, "DASHBOARD_DATA_ERROR");
    }
    
    public DashboardDataException(String message, Throwable cause) {
        super(message, cause, HttpStatus.INTERNAL_SERVER_ERROR, "DASHBOARD_DATA_ERROR");
    }
}

