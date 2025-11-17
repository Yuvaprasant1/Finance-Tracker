package com.finance.tracker.common.util;

import java.time.*;
import java.time.format.DateTimeFormatter;

/**
 * Utility class for date and time operations in IST (Indian Standard Time)
 * IST is UTC+5:30
 */
public class DateTimeUtils {
    
    public static final ZoneId IST_ZONE = ZoneId.of("Asia/Kolkata");
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    /**
     * Get current date and time in IST
     * @return LocalDateTime in IST
     */
    public static LocalDateTime getCurrentDateTimeIST() {
        return LocalDateTime.now(IST_ZONE);
    }
    
    /**
     * Get current date in IST (date only, no time)
     * @return LocalDate in IST
     */
    public static LocalDate getCurrentDateIST() {
        return LocalDate.now(IST_ZONE);
    }
    
    /**
     * Get current time in IST
     * @return LocalTime in IST
     */
    public static LocalTime getCurrentTimeIST() {
        return LocalTime.now(IST_ZONE);
    }
    
    /**
     * Convert a LocalDateTime to IST
     * @param dateTime LocalDateTime to convert
     * @return LocalDateTime in IST
     */
    public static LocalDateTime toIST(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        // If already in IST, return as is
        ZonedDateTime zonedDateTime = dateTime.atZone(ZoneId.systemDefault());
        return zonedDateTime.withZoneSameInstant(IST_ZONE).toLocalDateTime();
    }
    
    /**
     * Convert a LocalDate to IST (date remains the same, but ensures it's in IST context)
     * @param date LocalDate to convert
     * @return LocalDate in IST
     */
    public static LocalDate toIST(LocalDate date) {
        if (date == null) {
            return null;
        }
        // LocalDate doesn't have timezone, but we can ensure it's treated as IST
        return date;
    }
    
    /**
     * Get start of day in IST for a given date
     * @param date LocalDate
     * @return LocalDateTime at start of day in IST
     */
    public static LocalDateTime getStartOfDayIST(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.atStartOfDay().atZone(IST_ZONE).toLocalDateTime();
    }
    
    /**
     * Get end of day in IST for a given date
     * @param date LocalDate
     * @return LocalDateTime at end of day in IST
     */
    public static LocalDateTime getEndOfDayIST(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.atTime(23, 59, 59).atZone(IST_ZONE).toLocalDateTime();
    }
    
    /**
     * Get start of month in IST
     * @param yearMonth YearMonth
     * @return LocalDateTime at start of first day of month in IST
     */
    public static LocalDateTime getStartOfMonthIST(YearMonth yearMonth) {
        if (yearMonth == null) {
            return null;
        }
        return yearMonth.atDay(1).atStartOfDay().atZone(IST_ZONE).toLocalDateTime();
    }
    
    /**
     * Get end of month in IST
     * @param yearMonth YearMonth
     * @return LocalDateTime at end of last day of month in IST
     */
    public static LocalDateTime getEndOfMonthIST(YearMonth yearMonth) {
        if (yearMonth == null) {
            return null;
        }
        return yearMonth.atEndOfMonth().atTime(23, 59, 59).atZone(IST_ZONE).toLocalDateTime();
    }
    
    /**
     * Format LocalDate to string (yyyy-MM-dd)
     * @param date LocalDate to format
     * @return Formatted date string
     */
    public static String formatDate(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.format(DATE_FORMATTER);
    }
    
    /**
     * Format LocalDateTime to string (yyyy-MM-dd HH:mm:ss)
     * @param dateTime LocalDateTime to format
     * @return Formatted datetime string
     */
    public static String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DATETIME_FORMATTER);
    }
    
    /**
     * Parse date string to LocalDate
     * @param dateString Date string in yyyy-MM-dd format
     * @return LocalDate
     */
    public static LocalDate parseDate(String dateString) {
        if (dateString == null || dateString.trim().isEmpty()) {
            return null;
        }
        return LocalDate.parse(dateString, DATE_FORMATTER);
    }
    
    /**
     * Parse datetime string to LocalDateTime
     * @param dateTimeString Datetime string in yyyy-MM-dd HH:mm:ss format
     * @return LocalDateTime
     */
    public static LocalDateTime parseDateTime(String dateTimeString) {
        if (dateTimeString == null || dateTimeString.trim().isEmpty()) {
            return null;
        }
        return LocalDateTime.parse(dateTimeString, DATETIME_FORMATTER);
    }
}

