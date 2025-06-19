import { Product } from '../types';

/**
 * Helper function to get product image with fallback
 */
export const getProductImage = (product: Product): string => {
  if (product.gambar && product.gambar.trim() !== '') {
    // Check if it's a full URL
    if (product.gambar.startsWith('http')) {
      return product.gambar;
    }
    // For storage paths, prepend /storage/
    return `/storage/${product.gambar}`;
  }
  // Fallback to default product image
  return '/icons/product.png';
};

/**
 * Check if a product is considered "new" (created within the last 5 days)
 */
export const isNewProduct = (product: Product): boolean => {
  const createdDate = new Date(product.created_at);
  const now = new Date();
  const daysDiff = (now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
  return daysDiff <= 5; // Consider products created within 5 days as "new"
};

/**
 * Get the discount percentage for a product
 */
export const getDiscountPercentage = (product: Product): number => {
  if (product.is_diskon && product.diskon_persen) {
    return product.diskon_persen;
  }
  if (product.is_diskon && product.harga_diskon) {
    const originalPrice = parseFloat(product.harga);
    const discountPrice = parseFloat(product.harga_diskon);
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  }
  return 0;
};

/**
 * Get the effective price (discounted price if on discount, otherwise regular price)
 */
export const getEffectivePrice = (product: Product): string => {
  if (product.is_diskon && product.harga_diskon) {
    return product.harga_diskon;
  }
  return product.harga;
};

/**
 * Format price to Indonesian Rupiah format
 */
export const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `Rp. ${numPrice.toLocaleString('id-ID')}`;
};
