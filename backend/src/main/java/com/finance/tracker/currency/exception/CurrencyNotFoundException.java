package com.finance.tracker.currency.exception;

import com.finance.tracker.common.exception.BaseException;
import org.springframework.http.HttpStatus;

public class CurrencyNotFoundException extends BaseException {
    public CurrencyNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND, "CURRENCY_NOT_FOUND");
    }
    
    public static CurrencyNotFoundException byCode(String code) {
        return new CurrencyNotFoundException(
                String.format("Currency with code '%s' not found", code)
        );
    }
}

