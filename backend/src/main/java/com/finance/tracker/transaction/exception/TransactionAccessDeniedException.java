package com.finance.tracker.transaction.exception;

import com.finance.tracker.common.exception.BaseException;
import org.springframework.http.HttpStatus;

public class TransactionAccessDeniedException extends BaseException {
    public TransactionAccessDeniedException(String message) {
        super(message, HttpStatus.FORBIDDEN, "TRANSACTION_ACCESS_DENIED");
    }
    
    public static TransactionAccessDeniedException forId(String id) {
        return new TransactionAccessDeniedException(
                String.format("Access denied to transaction with id '%s'", id)
        );
    }
}

