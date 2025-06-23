/**
 * Utility functions for price handling and formatting
 */

/**
 * Round up price to the nearest appropriate value
 * Logic:
 * - If price is <= 20M, round up to nearest 5M increment
 * - If price is > 20M, round up to nearest 10M increment
 */
export const roundUpPrice = (price: number): number => {
  if (price <= 20000000) {
    // Round up to nearest 5M
    return Math.ceil(price / 5000000) * 5000000;
  } else {
    // Round up to nearest 10M
    return Math.ceil(price / 10000000) * 10000000;
  }
};

/**
 * Generate dynamic price range options based on highest price
 */
export const generatePriceRangeOptions = (highestPrice: number) => {
  const roundedHighest = roundUpPrice(highestPrice);
  
  return {
    option1: {
      min: 0,
      max: 1000000,
      label: 'Rp 0 - Rp 1.000.000'
    },
    option2: {
      min: 1000000,
      max: 10000000,
      label: 'Rp 1.000.000 - Rp 10.000.000'
    },
    option3: {
      min: 10000000,
      max: roundedHighest,
      label: `Rp 10.000.000 - Rp ${roundedHighest.toLocaleString('id-ID')}`
    },
    slider: {
      min: 0,
      max: roundedHighest,
      title: `0 to ${formatPrice(roundedHighest)}`
    }
  };
};

/**
 * Format price for display
 */
export const formatPrice = (price: number): string => {
  return `Rp ${price.toLocaleString('id-ID')}`;
};

/**
 * Format price range for display
 */
export const formatPriceRange = (min: number, max: number): string => {
  return `${formatPrice(min)} - ${formatPrice(max)}`;
};
