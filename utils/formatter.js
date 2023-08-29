const { format } = require("date-fns");

/**
 * Formats a numeric value as currency with Colombian Peso (COP) symbol.
 * @param {number} number - Numeric value to be formatted.
 * @returns {string} - Formatted currency string.
 */
const formatCurrency = (number) => {
  return new Intl.NumberFormat("es-CO", {
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

/**
 * Formats a date in "MMMM dd, yyyy" format.
 * @param {Date} date - Date to be formatted.
 * @returns {string} - Formatted date string.
 */
const dateFormatter = (date) => {
  return format(date, "MMMM dd, yyyy");
};

module.exports = { formatCurrency, dateFormatter };
