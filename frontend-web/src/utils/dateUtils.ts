/**
 * Date Utilities
 * Centralized date-related helper functions
 */

/**
 * Get the current date
 * @returns Current date as a Date object
 */
export const getCurrentDate = (): Date => {
  return new Date();
};

/**
 * Get today's date at start of day (00:00:00)
 * @returns Today's date at midnight
 */
export const getTodayStart = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * Get today's date at end of day (23:59:59)
 * @returns Today's date at end of day
 */
export const getTodayEnd = (): Date => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return today;
};

/**
 * Format date to ISO string (YYYY-MM-DD)
 * @param date - Date object to format
 * @returns Formatted date string
 */
export const formatDateToISO = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Check if a date is today
 * @param date - Date to check
 * @returns True if the date is today
 */
export const isToday = (date: Date): boolean => {
  const today = getTodayStart();
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate.getTime() === today.getTime();
};

/**
 * Check if a date is in the past
 * @param date - Date to check
 * @returns True if the date is before today
 */
export const isPastDate = (date: Date): boolean => {
  const today = getTodayStart();
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate.getTime() < today.getTime();
};

/**
 * Check if a date is in the future
 * @param date - Date to check
 * @returns True if the date is after today
 */
export const isFutureDate = (date: Date): boolean => {
  const today = getTodayStart();
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate.getTime() > today.getTime();
};

