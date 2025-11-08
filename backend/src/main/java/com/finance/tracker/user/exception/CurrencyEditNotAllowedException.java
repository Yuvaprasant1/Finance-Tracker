package com.finance.tracker.user.exception;

import com.finance.tracker.common.exception.BaseException;
import org.springframework.http.HttpStatus;

public class CurrencyEditNotAllowedException extends BaseException {
    public CurrencyEditNotAllowedException(String message) {
        super(message, HttpStatus.BAD_REQUEST, "CURRENCY_EDIT_NOT_ALLOWED");
    }
    
    public CurrencyEditNotAllowedException() {
        super("Currency cannot be changed after expenses have been created",
                HttpStatus.BAD_REQUEST, "CURRENCY_EDIT_NOT_ALLOWED");
    }
}

