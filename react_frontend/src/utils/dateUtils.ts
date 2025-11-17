/**
 * Date Utilities
 * Centralized date-related helper functions
 * All dates are in IST (Indian Standard Time - UTC+5:30)
 */

const IST_TIMEZONE = 'Asia/Kolkata';

/**
 * Get the current date in IST
 * @returns Current date as a Date object in IST
 */
export const getCurrentDate = (): Date => {
  const now = new Date();
  // Convert to IST
  return new Date(now.toLocaleString('en-US', { timeZone: IST_TIMEZONE }));
};

/**
 * Get today's date at start of day (00:00:00) in IST
 * @returns Today's date at midnight in IST
 */
export const getTodayStart = (): Date => {
  const today = getCurrentDate();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * Get today's date at end of day (23:59:59) in IST
 * @returns Today's date at end of day in IST
 */
export const getTodayEnd = (): Date => {
  const today = getCurrentDate();
  today.setHours(23, 59, 59, 999);
  return today;
};

/**
 * Format date to ISO string (YYYY-MM-DD) in IST
 * @param date - Date object to format
 * @returns Formatted date string (date only, no time)
 */
export const formatDateToISO = (date: Date): string => {
  // Format date in IST timezone
  const year = date.toLocaleString('en-US', { year: 'numeric', timeZone: IST_TIMEZONE });
  const month = date.toLocaleString('en-US', { month: '2-digit', timeZone: IST_TIMEZONE });
  const day = date.toLocaleString('en-US', { day: '2-digit', timeZone: IST_TIMEZONE });
  // Ensure zero-padding for month and day
  const paddedMonth = month.padStart(2, '0');
  const paddedDay = day.padStart(2, '0');
  return `${year}-${paddedMonth}-${paddedDay}`;
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

