/**
 * Format date string to display format (date only, no time)
 * Uses IST timezone
 * @param dateString - Date string (ISO format or LocalDate string)
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  
  // Handle both ISO datetime strings and date-only strings (YYYY-MM-DD)
  let date: Date;
  if (dateString.includes('T')) {
    // ISO datetime string
    date = new Date(dateString);
  } else {
    // Date-only string (YYYY-MM-DD) - parse as IST
    const [year, month, day] = dateString.split('-').map(Number);
    date = new Date(year, month - 1, day);
  }
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
};

/**
 * Format date string to display format (date only, no time)
 * This is the same as formatDate since transactions only store dates
 * Kept for backward compatibility
 * @param dateString - Date string
 * @returns Formatted date string (date only)
 */
export const formatDateWithTime = (dateString: string | undefined): string => {
  // Transactions only store dates, not times, so return date only
  return formatDate(dateString);
};

export const formatAmount = (amount: number | undefined, currency: string = 'INR'): string => {
  if (amount === undefined || amount === null) return '₹0.00';
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    AUD: 'A$',
    CAD: 'C$',
    CNY: '¥',
  };
  const symbol = currencySymbols[currency] || '₹';
  return `${symbol}${parseFloat(amount.toString()).toFixed(2)}`;
};

export const validatePhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10;
};

export const formatPhoneNumber = (text: string): string => {
  const cleaned = text.replace(/\D/g, '');
  return cleaned.slice(0, 10);
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

