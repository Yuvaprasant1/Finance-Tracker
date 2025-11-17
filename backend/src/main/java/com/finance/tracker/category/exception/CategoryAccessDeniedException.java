package com.finance.tracker.category.exception;

import com.finance.tracker.common.exception.BaseException;
import org.springframework.http.HttpStatus;

public class CategoryAccessDeniedException extends BaseException {
    public CategoryAccessDeniedException(String message) {
        super(message, HttpStatus.FORBIDDEN, "CATEGORY_ACCESS_DENIED");
    }
    
    public static CategoryAccessDeniedException defaultCategoryModification() {
        return new CategoryAccessDeniedException(
                "Default categories cannot be modified or deleted"
        );
    }
    
    public static CategoryAccessDeniedException unauthorizedAccess() {
        return new CategoryAccessDeniedException(
                "You do not have permission to access this category"
        );
    }
}

