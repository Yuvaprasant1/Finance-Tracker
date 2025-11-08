package com.finance.tracker.common.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Utility class for BigDecimal operations with default values and precision handling.
 */
public class BigDecimalUtils {
    
    /**
     * Default precision (decimal places) for amounts.
     */
    public static final int DEFAULT_PRECISION = 2;
    
    /**
     * Default rounding mode for amounts.
     */
    public static final RoundingMode DEFAULT_ROUNDING_MODE = RoundingMode.HALF_UP;
    
    /**
     * Default value for amounts when null.
     */
    public static final BigDecimal DEFAULT_AMOUNT = BigDecimal.ZERO;
    
    /**
     * Sets the amount with default value if null and applies precision.
     * Uses default precision (2 decimal places) and default rounding mode (HALF_UP).
     * 
     * @param amount the amount to process, can be null
     * @return BigDecimal with default value if null, otherwise rounded to default precision
     */
    public static BigDecimal setAmountWithDefault(BigDecimal amount) {
        return setAmountWithDefault(amount, DEFAULT_AMOUNT, DEFAULT_PRECISION, DEFAULT_ROUNDING_MODE);
    }
    
    /**
     * Sets the amount with custom default value if null and applies default precision.
     * 
     * @param amount the amount to process, can be null
     * @param defaultValue the default value to use if amount is null
     * @return BigDecimal with default value if null, otherwise rounded to default precision
     */
    public static BigDecimal setAmountWithDefault(BigDecimal amount, BigDecimal defaultValue) {
        return setAmountWithDefault(amount, defaultValue, DEFAULT_PRECISION, DEFAULT_ROUNDING_MODE);
    }
    
    /**
     * Sets the amount with default value if null and applies custom precision.
     * 
     * @param amount the amount to process, can be null
     * @param precision the number of decimal places (precision)
     * @return BigDecimal with default value if null, otherwise rounded to specified precision
     */
    public static BigDecimal setAmountWithDefault(BigDecimal amount, int precision) {
        return setAmountWithDefault(amount, DEFAULT_AMOUNT, precision, DEFAULT_ROUNDING_MODE);
    }
    
    /**
     * Sets the amount with custom default value and custom precision.
     * 
     * @param amount the amount to process, can be null
     * @param defaultValue the default value to use if amount is null
     * @param precision the number of decimal places (precision)
     * @return BigDecimal with default value if null, otherwise rounded to specified precision
     */
    public static BigDecimal setAmountWithDefault(BigDecimal amount, BigDecimal defaultValue, int precision) {
        return setAmountWithDefault(amount, defaultValue, precision, DEFAULT_ROUNDING_MODE);
    }
    
    /**
     * Sets the amount with full configuration options.
     * 
     * @param amount the amount to process, can be null
     * @param defaultValue the default value to use if amount is null
     * @param precision the number of decimal places (precision)
     * @param roundingMode the rounding mode to apply
     * @return BigDecimal with default value if null, otherwise rounded to specified precision with specified rounding mode
     */
    public static BigDecimal setAmountWithDefault(BigDecimal amount, BigDecimal defaultValue, int precision, RoundingMode roundingMode) {
        if (amount == null) {
            return defaultValue != null 
                ? defaultValue.setScale(precision, roundingMode)
                : DEFAULT_AMOUNT.setScale(precision, roundingMode);
        }
        return amount.setScale(precision, roundingMode);
    }
    
    /**
     * Applies precision to a non-null BigDecimal.
     * Throws NullPointerException if amount is null.
     * 
     * @param amount the amount to round, must not be null
     * @param precision the number of decimal places (precision)
     * @return BigDecimal rounded to specified precision with default rounding mode
     * @throws NullPointerException if amount is null
     */
    public static BigDecimal applyPrecision(BigDecimal amount, int precision) {
        return applyPrecision(amount, precision, DEFAULT_ROUNDING_MODE);
    }
    
    /**
     * Applies precision and rounding mode to a non-null BigDecimal.
     * Throws NullPointerException if amount is null.
     * 
     * @param amount the amount to round, must not be null
     * @param precision the number of decimal places (precision)
     * @param roundingMode the rounding mode to apply
     * @return BigDecimal rounded to specified precision with specified rounding mode
     * @throws NullPointerException if amount is null
     */
    public static BigDecimal applyPrecision(BigDecimal amount, int precision, RoundingMode roundingMode) {
        if (amount == null) {
            throw new NullPointerException("Amount cannot be null. Use setAmountWithDefault() if null values are expected.");
        }
        return amount.setScale(precision, roundingMode);
    }
    
    /**
     * Checks if the amount is null or zero.
     * 
     * @param amount the amount to check
     * @return true if amount is null or equals to zero
     */
    public static boolean isNullOrZero(BigDecimal amount) {
        return amount == null || amount.compareTo(BigDecimal.ZERO) == 0;
    }
    
    /**
     * Checks if the amount is positive (greater than zero).
     * 
     * @param amount the amount to check
     * @return true if amount is not null and greater than zero
     */
    public static boolean isPositive(BigDecimal amount) {
        return amount != null && amount.compareTo(BigDecimal.ZERO) > 0;
    }
    
    /**
     * Checks if the amount is negative (less than zero).
     * 
     * @param amount the amount to check
     * @return true if amount is not null and less than zero
     */
    public static boolean isNegative(BigDecimal amount) {
        return amount != null && amount.compareTo(BigDecimal.ZERO) < 0;
    }
}

