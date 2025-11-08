package com.finance.tracker.transaction.exception;

import com.finance.tracker.common.exception.BaseException;
import org.springframework.http.HttpStatus;

public class TransactionNotFoundException extends BaseException {
    public TransactionNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND, "TRANSACTION_NOT_FOUND");
    }
    
    public static TransactionNotFoundException byIdAndPhoneNumber(String id, String phoneNumber) {
        return new TransactionNotFoundException(
                String.format("Transaction with id '%s' not found for user '%s'", id, phoneNumber)
        );
    }
    
    public static TransactionNotFoundException byIdAndUserId(String id, String userId) {
        return new TransactionNotFoundException(
                String.format("Transaction with id '%s' not found for user ID '%s'", id, userId)
        );
    }
}

