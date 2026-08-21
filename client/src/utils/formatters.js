/**
 * Formats a number into Bangladeshi Taka currency format (e.g. ৳45,000)
 * @param {number} amount
 * @returns {string}
 */
export const formatPrice = (amount) => {
  if (amount === undefined || amount === null) return '৳0';
  return `৳${Number(amount).toLocaleString('en-IN')}`;
};

/**
 * Formats a date string into readable format
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Truncate long strings
 */
export const truncateText = (text, maxLength = 80) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};
