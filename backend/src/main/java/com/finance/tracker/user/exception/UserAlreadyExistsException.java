package com.finance.tracker.user.exception;

import com.finance.tracker.common.exception.BaseException;
import org.springframework.http.HttpStatus;

public class UserAlreadyExistsException extends BaseException {
    public UserAlreadyExistsException(String message) {
        super(message, HttpStatus.CONFLICT, "USER_ALREADY_EXISTS");
    }
    
    public static UserAlreadyExistsException byPhoneNumber(String phoneNumber) {
        return new UserAlreadyExistsException(
                String.format("User with phone number '%s' already exists", phoneNumber)
        );
    }
}

