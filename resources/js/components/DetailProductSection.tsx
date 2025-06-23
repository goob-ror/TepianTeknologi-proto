import { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { getProductImage, formatPrice, getEffectivePrice, getDiscountPercentage } from '../utils/productUtils';
import { generatePriceRangeOptions } from '../utils/priceUtils';
import { router } from '@inertiajs/react';
import { useCart } from '../hooks/useCart';
import Swal from 'sweetalert2';

interface DetailProductSectionProps {
  product: Product;
  highestPrice: number;
}

export default function DetailProductSection({ product, highestPrice }: DetailProductSectionProps) {
  // Generate dynamic price range options
  const priceRangeOptions = generatePriceRangeOptions(highestPrice);
  // Add CSS animations for price filter dropdown
  const dropdownAnimationStyles = `
    @keyframes dropdownFadeIn {
      0% {
        opacity: 0;
        transform: translateY(-8px) scale(0.95);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes dropdownFadeOut {
      0% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      100% {
        opacity: 0;
        transform: translateY(-8px) scale(0.95);
      }
    }

    @keyframes bounceIn {
      0% {
        transform: scale(0.3);
        opacity: 0;
      }
      50% {
        transform: scale(1.05);
      }
      70% {
        transform: scale(0.9);
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
  `;

  const { addToCart } = useCart();
  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState('Semua Harga');
  const [selectedPriceRange, setSelectedPriceRange] = useState('price-all');
  const [customMinPrice, setCustomMinPrice] = useState(0);
  const [customMaxPrice, setCustomMaxPrice] = useState(priceRangeOptions.slider.max);
  const [quantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize custom price values when priceRangeOptions changes
  useEffect(() => {
    setCustomMaxPrice(priceRangeOptions.slider.max);
  }, [priceRangeOptions.slider.max]);

  const handlePriceRangeChange = (value: string, label: string) => {
    // Always update the selected state first
    setSelectedPriceRange(value);
    setSelectedPriceFilter(label);

    // Handle custom range selection differently
    if (value === 'custom') {
      // For custom range, just update state and keep dropdown open
      // Initialize custom values to current defaults
      setCustomMinPrice(0);
      setCustomMaxPrice(priceRangeOptions.slider.max);
      // Don't close dropdown, don't apply filter yet
      return;
    }

    // For predefined ranges, update custom values
    if (value === 'price-all') {
      setCustomMinPrice(0);
      setCustomMaxPrice(priceRangeOptions.slider.max);
    } else if (value === 'price-range1') {
      setCustomMinPrice(priceRangeOptions.option1.min);
      setCustomMaxPrice(priceRangeOptions.option1.max);
    } else if (value === 'price-range2') {
      setCustomMinPrice(priceRangeOptions.option2.min);
      setCustomMaxPrice(priceRangeOptions.option2.max);
    } else if (value === 'price-range3') {
      setCustomMinPrice(priceRangeOptions.option3.min);
      setCustomMaxPrice(priceRangeOptions.option3.max);
    }

    // Close dropdown for predefined ranges
    setIsPriceFilterOpen(false);
  };

  const handleCustomMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(event.target.value) || 0);
    const clampedValue = Math.min(value, customMaxPrice); // Ensure min doesn't exceed max
    setCustomMinPrice(clampedValue);

    // Update display in real-time
    const formattedRange = `Rp ${clampedValue.toLocaleString('id-ID')} - Rp ${customMaxPrice.toLocaleString('id-ID')}`;
    setSelectedPriceFilter(formattedRange);
  };

  const handleCustomMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value) || priceRangeOptions.slider.max;
    const clampedValue = Math.max(customMinPrice, Math.min(value, priceRangeOptions.slider.max)); // Ensure max is within bounds
    setCustomMaxPrice(clampedValue);

    // Update display in real-time
    const formattedRange = `Rp ${customMinPrice.toLocaleString('id-ID')} - Rp ${clampedValue.toLocaleString('id-ID')}`;
    setSelectedPriceFilter(formattedRange);
  };

  const handleCustomRangeApply = () => {
    // Close the dropdown
    setIsPriceFilterOpen(false);

    // Apply the custom filter
    const currentParams = new URLSearchParams(window.location.search);

    if (customMinPrice === 0 && customMaxPrice === priceRangeOptions.slider.max) {
      // If at full range, remove price filters (equivalent to Semua Harga)
      currentParams.delete('price_min');
      currentParams.delete('price_max');
      setSelectedPriceFilter('Semua Harga');
      setSelectedPriceRange('price-all');
    } else {
      // Apply custom price range
      currentParams.set('price_min', customMinPrice.toString());
      currentParams.set('price_max', customMaxPrice.toString());
      // Update the display label
      const formattedRange = `Rp ${customMinPrice.toLocaleString('id-ID')} - Rp ${customMaxPrice.toLocaleString('id-ID')}`;
      setSelectedPriceFilter(formattedRange);
    }

    router.get('/katalog', Object.fromEntries(currentParams), {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleAddToCart = async () => {
    if (isAddingToCart) return;

    setIsAddingToCart(true);

    try {
      // Check stock availability
      if (product.stok < quantity) {
        throw new Error(`Stok tidak mencukupi. Stok tersedia: ${product.stok}`);
      }

      // Prepare product data for localStorage
      const productData = {
        id: product.id,
        nama_produk: product.nama_produk,
        harga: parseFloat(product.harga),
        harga_diskon: product.harga_diskon ? parseFloat(product.harga_diskon) : undefined,
        is_diskon: product.is_diskon,
        gambar: product.gambar,
        stok: product.stok,
        category: product.category?.nama_kategori || 'Uncategorized',
      };

      // Add to cart using localStorage
      const result = await addToCart(productData, quantity);

      if (result.success) {
        Swal.fire({
          title: 'Berhasil!',
          text: result.message,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: 'var(--secondary-color)',
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Swal.fire({
        title: 'Error',
        text: error instanceof Error ? error.message : 'Terjadi kesalahan saat menambahkan ke keranjang',
        icon: 'error',
        confirmButtonText: 'OK',
        background: 'var(--secondary-color)',
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    // First add to cart, then redirect to checkout
    await handleAddToCart();

    // Small delay to ensure cart is updated
    setTimeout(() => {
      router.visit('/checkout');
    }, 500);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPriceFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className="katalog-section w-full"
      style={{
        flex: 1,
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--secondary-color)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        width: '1000px'
      }}
    >
      <style>{dropdownAnimationStyles}</style>

      {/* Katalog Header */}
      <div
        className="katalog-header"
        style={{ marginBottom: '15px' }}
      >
        <h1
          style={{
            fontFamily: 'var(--main-font)',
            fontSize: 'var(--font-size-xlarge)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--grey-text)',
            marginBottom: '15px'
          }}
        >
          Katalog Produk
        </h1>
        <hr
          style={{
            border: 'none',
            borderTop: '3px solid #D9D9D9',
            width: '250px',
            marginBottom: '30px'
          }}
        />

        {/* Price Filter */}
        <div className="filter-price">
          <div
            className="filter-header"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end'
            }}
          >
            <h2>Pilih rentang harga: </h2>
            <div
              className="filter-price-dropdown"
              ref={dropdownRef}
              style={{
                padding: '5px 15px',
                width: '250px',
                border: '2px solid #D9D9D9',
                backgroundColor: 'var(--secondary-color)',
                borderRadius: '15px',
                position: 'absolute',
                zIndex: 10,
                top: '412px'
              }}
            >
              <button
                className="dropdown-button"
                onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  width: '100%',
                  cursor: 'pointer'
                }}
              >
                <span
                  className="dropdown-icon"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <p
                    id="selected-price-filter"
                    style={{
                      margin: 0,
                      fontFamily: 'var(--main-font)',
                      fontSize: '12px',
                      color: 'var(--grey-text)'
                    }}
                  >
                    {selectedPriceFilter}
                  </p>
                  <img
                    src="/icons/dropdown-arrow.png"
                    className={`dropdown-button-arrow ${isPriceFilterOpen ? 'rotate-180' : ''}`}
                    alt="Dropdown"
                    style={{
                      transition: 'transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                      transformOrigin: 'center',
                      transform: isPriceFilterOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  />
                </span>
              </button>

              <div
                className="price-filter-options"
                style={{
                  display: isPriceFilterOpen ? 'block' : 'none',
                  animation: isPriceFilterOpen ? 'dropdownFadeIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'dropdownFadeOut 0.25s ease-in-out',
                  transformOrigin: 'top center',
                  padding: '0 0 10px 0'
                }}
              >
                <hr
                  style={{
                    width: '200px',
                    marginBottom: '15px'
                  }}
                />
                <div className="price-range-options">
                  <div
                    className="checkbox-item"
                    style={{
                      animation: isPriceFilterOpen ? 'bounceIn 0.5s ease-out 0.1s both' : 'none',
                      transition: 'transform 0.2s ease, background-color 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '5px',
                      borderRadius: '4px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(3px)';
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <input
                      type="radio"
                      id="price-all"
                      name="price-range"
                      checked={selectedPriceRange === 'price-all'}
                      onChange={() => handlePriceRangeChange('price-all', 'Semua Harga')}
                    />
                    <label htmlFor="price-all" style={{ fontSize: '12px' }}>Semua Harga</label>
                  </div>
                  <div
                    className="checkbox-item"
                    style={{
                      animation: isPriceFilterOpen ? 'bounceIn 0.5s ease-out 0.2s both' : 'none',
                      transition: 'transform 0.2s ease, background-color 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '5px',
                      borderRadius: '4px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(3px)';
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <input
                      type="radio"
                      id="price-range1"
                      name="price-range"
                      checked={selectedPriceRange === 'price-range1'}
                      onChange={() => handlePriceRangeChange('price-range1', priceRangeOptions.option1.label)}
                    />
                    <label htmlFor="price-range1" style={{ fontSize: '12px' }}>{priceRangeOptions.option1.label}</label>
                  </div>
                  <div
                    className="checkbox-item"
                    style={{
                      animation: isPriceFilterOpen ? 'bounceIn 0.5s ease-out 0.3s both' : 'none',
                      transition: 'transform 0.2s ease, background-color 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '5px',
                      borderRadius: '4px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(3px)';
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <input
                      type="radio"
                      id="price-range2"
                      name="price-range"
                      checked={selectedPriceRange === 'price-range2'}
                      onChange={() => handlePriceRangeChange('price-range2', priceRangeOptions.option2.label)}
                    />
                    <label htmlFor="price-range2" style={{ fontSize: '12px' }}>{priceRangeOptions.option2.label}</label>
                  </div>
                  <div
                    className="checkbox-item"
                    style={{
                      animation: isPriceFilterOpen ? 'bounceIn 0.5s ease-out 0.4s both' : 'none',
                      transition: 'transform 0.2s ease, background-color 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '5px',
                      borderRadius: '4px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(3px)';
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <input
                      type="radio"
                      id="price-range3"
                      name="price-range"
                      checked={selectedPriceRange === 'price-range3'}
                      onChange={() => handlePriceRangeChange('price-range3', priceRangeOptions.option3.label)}
                    />
                    <label htmlFor="price-range3" style={{ fontSize: '12px' }}>{priceRangeOptions.option3.label}</label>
                  </div>
                  <div
                    className="checkbox-item"
                    style={{
                      animation: isPriceFilterOpen ? 'bounceIn 0.5s ease-out 0.5s both' : 'none',
                      transition: 'transform 0.2s ease, background-color 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '5px',
                      borderRadius: '4px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(3px)';
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <input
                      type="radio"
                      id="price-custom"
                      name="price-range"
                      checked={selectedPriceRange === 'custom'}
                      onChange={() => handlePriceRangeChange('custom', 'Custom Range')}
                    />
                    <label htmlFor="price-custom" style={{ fontSize: '12px' }}>Custom Range</label>
                  </div>
                </div>
                {/* Custom Range Section - Only shows when Custom Range is selected */}
                {selectedPriceRange === 'custom' && (
                  <div
                    className="custom-price-range"
                    style={{
                      animation: 'bounceIn 0.5s ease-out',
                      padding: '15px 0',
                      borderTop: '1px solid #E0E0E0',
                      marginTop: '10px'
                    }}
                  >
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--grey-text)' }}>
                        Custom Price Range:
                      </label>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontSize: '10px', color: 'var(--grey-text)' }}>
                          Min: Rp {customMinPrice.toLocaleString('id-ID')}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--grey-text)' }}>
                          Max: Rp {customMaxPrice.toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div style={{ position: 'relative', marginBottom: '10px' }}>
                        <label style={{ fontSize: '10px', color: 'var(--grey-text)', display: 'block', marginBottom: '5px' }}>
                          Price Range:
                        </label>

                        {/* Dual Range Slider Container */}
                        <div style={{ position: 'relative', height: '6px', backgroundColor: '#D9D9D9', borderRadius: '3px' }}>
                          {/* Active range track */}
                          <div
                            style={{
                              position: 'absolute',
                              height: '6px',
                              backgroundColor: 'var(--primary-color)',
                              borderRadius: '3px',
                              left: `${(customMinPrice / priceRangeOptions.slider.max) * 100}%`,
                              width: `${((customMaxPrice - customMinPrice) / priceRangeOptions.slider.max) * 100}%`
                            }}
                          />

                          {/* Min slider */}
                          <input
                            type="range"
                            min={0}
                            max={priceRangeOptions.slider.max}
                            step={100000}
                            value={customMinPrice}
                            onChange={handleCustomMinChange}
                            style={{
                              position: 'absolute',
                              width: '100%',
                              height: '6px',
                              background: 'transparent',
                              outline: 'none',
                              cursor: 'pointer',
                              appearance: 'none',
                              WebkitAppearance: 'none',
                              zIndex: 1
                            }}
                          />

                          {/* Max slider */}
                          <input
                            type="range"
                            min={0}
                            max={priceRangeOptions.slider.max}
                            step={100000}
                            value={customMaxPrice}
                            onChange={handleCustomMaxChange}
                            style={{
                              position: 'absolute',
                              width: '100%',
                              height: '6px',
                              background: 'transparent',
                              outline: 'none',
                              cursor: 'pointer',
                              appearance: 'none',
                              WebkitAppearance: 'none',
                              zIndex: 2
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleCustomRangeApply}
                      style={{
                        width: '100%',
                        padding: '8px',
                        backgroundColor: 'var(--primary-color)',
                        color: 'var(--light-text)',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Apply Custom Range
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div
        className="detail-product"
        style={{
          margin: '0 auto',
          display: 'flex',
          border: '1px solid #D9D9D9',
          flexDirection: 'row',
          gap: '10px',
          fontFamily: 'var(--main-font)',
          fontSize: 'var(--font-size-medium)',
          fontWeight: 'var(--font-weight-regular)',
          color: 'var(--grey-text)'
        }}
      >
        <div
          className="detail-product-images"
          style={{
            height: '100%',
            width: '350px',
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'antiquewhite'
          }}
        >
          <img src={getProductImage(product)} alt={product.nama_produk} />
        </div>

        <div
          className="detail-product-content"
          style={{ padding: '20px' }}
        >
          <div
            className="detail-product-header"
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '520px'
            }}
          >
            <h1
              style={{
                fontSize: 'var(--font-size-xlarge)',
                fontWeight: 'var(--font-weight-bold)',
                margin: '0 0 15px 0'
              }}
            >
              {product.nama_produk}
            </h1>
            <div
              className="detail-product-price"
              style={{
                fontSize: 'var(--font-size-large)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--primary-color)',
                position: 'relative',
                margin: '0 0 0 0'
              }}
            >
              {product.is_diskon && product.harga_diskon && (
                <p
                  className="diskon-price"
                  style={{
                    fontSize: 'var(--font-size-medium)',
                    color: '#FA766A',
                    textDecoration: 'line-through',
                    margin: '0 0 10px 0'
                  }}
                >
                  {formatPrice(parseFloat(product.harga))}
                </p>
              )}
              <p style={{ margin: 0 }}>{formatPrice(getEffectivePrice(product))}</p>
              {product.is_diskon && getDiscountPercentage(product) > 0 && (
                <div
                  className="diskon-tag"
                  style={{
                    position: 'absolute',
                    left: '110px',
                    top: '0',
                    width: 'fit-content',
                    backgroundColor: 'var(--primary-color)',
                    color: 'var(--light-text)',
                    padding: '1px 1px'
                  }}
                >
                  <h2
                    style={{
                      fontSize: 'var(--font-size-small)',
                      margin: 0,
                      padding: '2px'
                    }}
                  >
                    {getDiscountPercentage(product)}%
                  </h2>
                </div>
              )}
            </div>
          </div>

          <div
            className="detail-information"
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: '20px'
            }}
          >
            <h1
              style={{
                fontSize: 'var(--font-size-large)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--grey-text)',
                marginBottom: '15px'
              }}
            >
              Informasi Produk
            </h1>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}
            >
              <li
                data-label="Brand"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '5px',
                  fontSize: 'var(--font-size-medium)',
                  color: 'var(--grey-text)'
                }}
              >
                <span style={{ width: '100px', display: 'inline-block' }}>Brand</span>
                <span style={{ margin: '0 5px' }}>:</span>
                <p style={{
                  margin: 0,
                  color: 'var(--primary-color)',
                  fontWeight: 'var(--font-weight-semibold)'
                }}>
                  {product.brand?.nama_brand || 'N/A'}
                </p>
              </li>
              <li
                data-label="Kategori"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '5px',
                  fontSize: 'var(--font-size-medium)',
                  color: 'var(--grey-text)'
                }}
              >
                <span style={{ width: '100px', display: 'inline-block' }}>Kategori</span>
                <span style={{ margin: '0 5px' }}>:</span>
                <p style={{
                  margin: 0,
                  color: 'var(--primary-color)',
                  fontWeight: 'var(--font-weight-semibold)'
                }}>
                  {product.category?.nama_kategori || 'N/A'}
                </p>
              </li>
              <li
                data-label="Stok"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '5px',
                  fontSize: 'var(--font-size-medium)',
                  color: 'var(--grey-text)'
                }}
              >
                <span style={{ width: '100px', display: 'inline-block' }}>Stok</span>
                <span style={{ margin: '0 5px' }}>:</span>
                <p style={{
                  margin: 0,
                  color: product.stok > 10 ? 'var(--primary-color)' : product.stok > 0 ? '#FA766A' : '#FF0000',
                  fontWeight: 'var(--font-weight-semibold)'
                }}>
                  {product.stok > 0 ? `${product.stok} unit` : 'Stok habis'}
                </p>
              </li>
            </ul>
          </div>

          <div
            className="detail-product-buttons"
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '20px',
              margin: '50px 0 0 0'
            }}
          >
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stok === 0}
              style={{
                background: 'none',
                border: 'none',
                cursor: product.stok === 0 ? 'not-allowed' : 'pointer',
                opacity: product.stok === 0 ? 0.5 : 1,
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (product.stok > 0) {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <img
                src="/icons/shopping-cart.png"
                className="cart-product"
                style={{
                  width: '50px',
                  height: '45px'
                }}
                alt="Add to Cart"
              />
            </button>
            <button
              className="buy-button"
              onClick={handleBuyNow}
              disabled={isAddingToCart || product.stok === 0}
              style={{
                backgroundColor: product.stok === 0 ? '#ccc' : 'var(--primary-color)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: product.stok === 0 ? 'not-allowed' : 'pointer',
                fontSize: 'var(--font-size-medium)',
                fontWeight: 'var(--font-weight-semibold)',
                transition: 'background-color 0.3s ease',
                opacity: isAddingToCart ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (product.stok > 0 && !isAddingToCart) {
                  e.currentTarget.style.backgroundColor = '#285eff';
                }
              }}
              onMouseLeave={(e) => {
                if (product.stok > 0 && !isAddingToCart) {
                  e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                }
              }}
            >
              {isAddingToCart ? 'Menambahkan...' : product.stok === 0 ? 'Stok Habis' : 'Beli Sekarang'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
