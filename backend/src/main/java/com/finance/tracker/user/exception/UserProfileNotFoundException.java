package com.finance.tracker.user.exception;

import com.finance.tracker.common.exception.BaseException;
import org.springframework.http.HttpStatus;

public class UserProfileNotFoundException extends BaseException {
    public UserProfileNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND, "USER_PROFILE_NOT_FOUND");
    }
    
    public static UserProfileNotFoundException byPhoneNumber(String phoneNumber) {
        return new UserProfileNotFoundException(
                String.format("User profile for phone number '%s' not found", phoneNumber)
        );
    }
    
    public static UserProfileNotFoundException byUserId(String userId) {
        return new UserProfileNotFoundException(
                String.format("User profile for user ID '%s' not found", userId)
        );
    }
}

