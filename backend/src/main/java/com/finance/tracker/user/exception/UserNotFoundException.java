package com.finance.tracker.user.exception;

import com.finance.tracker.common.exception.BaseException;
import org.springframework.http.HttpStatus;

public class UserNotFoundException extends BaseException {
    public UserNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND, "USER_NOT_FOUND");
    }
    
    public static UserNotFoundException byPhoneNumber(String phoneNumber) {
        return new UserNotFoundException(
                String.format("User with phone number '%s' not found", phoneNumber)
        );
    }
    
    public static UserNotFoundException byId(String id) {
        return new UserNotFoundException(
                String.format("User with id '%s' not found", id)
        );
    }
}

