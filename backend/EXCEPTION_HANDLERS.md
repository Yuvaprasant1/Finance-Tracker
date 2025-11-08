# Exception Handlers Structure

This document provides an overview of the exception handling architecture in the Finance Tracker application.

## Overview

The application uses a **package-based exception handling** approach where each package has its own exception handler for better organization and maintainability.

## Handler Structure

### 1. Global Exception Handler
**Location:** `com.finance.tracker.common.exception.GlobalExceptionHandler`

**Purpose:** Handles common Spring exceptions and serves as a fallback for unhandled exceptions.

**Handles:**
- `MethodArgumentNotValidException` - Spring validation errors
- `ConstraintViolationException` - Constraint validation errors
- `Exception` - Generic fallback for all unhandled exceptions

### 2. Transaction Package Handler
**Location:** `com.finance.tracker.transaction.exception.handler.TransactionExceptionHandler`

**Scope:** `@RestControllerAdvice(basePackages = "com.finance.tracker.transaction")`

**Handles:**
- `TransactionNotFoundException` - When transaction is not found
- `TransactionValidationException` - When transaction validation fails
- `TransactionAccessDeniedException` - When user tries to access another user's transaction

### 3. User Package Handler
**Location:** `com.finance.tracker.user.exception.handler.UserExceptionHandler`

**Scope:** `@RestControllerAdvice(basePackages = "com.finance.tracker.user")`

**Handles:**
- `UserNotFoundException` - When user is not found
- `UserAlreadyExistsException` - When trying to create duplicate user
- `UserProfileNotFoundException` - When user profile is not found
- `CurrencyEditNotAllowedException` - When trying to edit currency after expens exist

### 4. Dashboard Package Handler
**Location:** `com.finance.tracker.dashboard.exception.handler.DashboardExceptionHandler`

**Scope:** `@RestControllerAdvice(basePackages = "com.finance.tracker.dashboard")`

**Handles:**
- `DashboardDataException` - When dashboard data retrieval fails

### 5. Currency Package Handler
**Location:** `com.finance.tracker.currency.exception.handler.CurrencyExceptionHandler`

**Scope:** `@RestControllerAdvice(basePackages = "com.finance.tracker.currency")`

**Handles:**
- `CurrencyNotFoundException` - When currency is not found

## Exception Classes

### Base Exception
- `BaseException` - Abstract base class for all custom exceptions
  - Contains: `httpStatus`, `errorCode`, `timestamp`, `message`

### Transaction Exceptions
- `TransactionNotFoundException` - Transaction not found
- `TransactionValidationException` - Transaction validation failed
- `TransactionAccessDeniedException` - Access denied to transaction

### User Exceptions
- `UserNotFoundException` - User not found
- `UserAlreadyExistsException` - User already exists
- `UserProfileNotFoundException` - User profile not found
- `CurrencyEditNotAllowedException` - Currency edit not allowed after transactions exist

### Dashboard Exceptions
- `DashboardDataException` - Dashboard data error

### Currency Exceptions
- `CurrencyNotFoundException` - Currency not found

## Response Format

All exceptions return a standardized `ApiResponse<ErrorDetails>` format:

```json
{
  "data": {
    "error": "ERROR_CODE",
    "message": "Human readable message",
    "timestamp": "2024-01-01T12:00:00",
    "path": "/api/transactions/123",
    "details": {}
  },
  "status": 404
}
```

## Usage Example

```java
// In Service Layer
throw TransactionNotFoundException.byIdAndUserId(id, userId);

// Handler automatically catches and formats response
// Returns ApiResponse<ErrorDetails> with status 404
```

## Benefits

1. **Package Isolation** - Each package manages its own exceptions
2. **Easy Navigation** - Find exception handlers in the same package
3. **Maintainability** - Clear separation of concerns
4. **Consistent Format** - All errors follow the same response structure
5. **Type Safety** - Static factory methods prevent duplicate constructors

