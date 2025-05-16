/**
 * Format a number as currency with the specified locale and currency code
 * @param value - The number to format
 * @param locale - The locale to use for formatting (default: 'id-ID' for Indonesian)
 * @param currency - The currency code (default: 'IDR' for Indonesian Rupiah)
 * @returns Formatted currency string
 */
export function formatCurrency(
    value: number | string,
    locale: string = 'id-ID',
    currency: string = 'IDR'
): string {
    // Convert string to number if needed
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // Handle NaN or invalid values
    if (isNaN(numericValue)) {
        return '0';
    }
    
    // Format the currency
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numericValue);
}
