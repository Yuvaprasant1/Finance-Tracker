package com.finance.tracker.user.exception;

import com.finance.tracker.common.exception.BaseException;
import org.springframework.http.HttpStatus;

public class UserProfileAlreadyExistsException extends BaseException {
    public UserProfileAlreadyExistsException(String message) {
        super(message, HttpStatus.CONFLICT, "USER_PROFILE_ALREADY_EXISTS");
    }
    
    public static UserProfileAlreadyExistsException byUserId(String userId) {
        return new UserProfileAlreadyExistsException(
                String.format("User profile for user ID '%s' already exists", userId)
        );
    }
}

