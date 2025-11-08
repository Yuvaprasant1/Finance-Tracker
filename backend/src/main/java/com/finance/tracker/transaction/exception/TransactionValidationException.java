package com.finance.tracker.transaction.exception;

import com.finance.tracker.common.exception.BaseException;
import org.springframework.http.HttpStatus;

public class TransactionValidationException extends BaseException {
    public TransactionValidationException(String message) {
        super(message, HttpStatus.BAD_REQUEST, "TRANSACTION_VALIDATION_ERROR");
    }
}

