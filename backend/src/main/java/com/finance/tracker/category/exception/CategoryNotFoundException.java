package com.finance.tracker.category.exception;

import com.finance.tracker.common.exception.BaseException;
import org.springframework.http.HttpStatus;

public class CategoryNotFoundException extends BaseException {
    public CategoryNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND, "CATEGORY_NOT_FOUND");
    }
    
    public static CategoryNotFoundException byId(String id) {
        return new CategoryNotFoundException(
                String.format("Category with id '%s' not found", id)
        );
    }
}

