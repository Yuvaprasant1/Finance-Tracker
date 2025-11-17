package com.finance.tracker.category.exception;

import com.finance.tracker.common.exception.BaseException;
import org.springframework.http.HttpStatus;

public class CategoryValidationException extends BaseException {
    public CategoryValidationException(String message) {
        super(message, HttpStatus.BAD_REQUEST, "CATEGORY_VALIDATION_ERROR");
    }
    
    public static CategoryValidationException duplicateName(String name) {
        return new CategoryValidationException(
                String.format("Category with name '%s' already exists", name)
        );
    }
    
    public static CategoryValidationException invalidCharacters() {
        return new CategoryValidationException(
                "Category name must contain only alphanumeric characters and spaces"
        );
    }
}

