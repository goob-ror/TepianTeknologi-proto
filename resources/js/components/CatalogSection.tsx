import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { Product } from '../types';
import { getProductImage, isNewProduct, getDiscountPercentage, getEffectivePrice, formatPrice } from '../utils/productUtils';
import { generatePriceRangeOptions } from '../utils/priceUtils';

interface CatalogSectionProps {
  products: {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
  filters: {
    category_id?: string;
    brand_id?: string;
    price_min?: string;
    price_max?: string;
    search?: string;
    sort_by?: string;
    sort_order?: string;
  };
  highestPrice: number;
}

export default function CatalogSection({ products, filters, highestPrice }: CatalogSectionProps) {
  // Generate dynamic price range options
  const priceRangeOptions = generatePriceRangeOptions(highestPrice);
  // Add CSS animations
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

  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState('Semua Harga');
  const [selectedPriceRange, setSelectedPriceRange] = useState('price-all');
  const [customMinPrice, setCustomMinPrice] = useState(0);
  const [customMaxPrice, setCustomMaxPrice] = useState(priceRangeOptions.slider.max);
  const [selectedPerPage, setSelectedPerPage] = useState(products.per_page);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize custom price values when priceRangeOptions changes
  useEffect(() => {
    setCustomMaxPrice(priceRangeOptions.slider.max);
  }, [priceRangeOptions.slider.max]);

  // Initialize price filter based on current filters (only when not user interacting)
  useEffect(() => {
    if (isUserInteracting) return; // Don't override user selections

    if (filters.price_min && filters.price_max) {
      const min = parseInt(filters.price_min);
      const max = parseInt(filters.price_max);

      // Update custom price values
      setCustomMinPrice(min);
      setCustomMaxPrice(max);

      if (min === priceRangeOptions.option1.min && max === priceRangeOptions.option1.max) {
        setSelectedPriceFilter(priceRangeOptions.option1.label);
        setSelectedPriceRange('price-range1');
      } else if (min === priceRangeOptions.option2.min && max === priceRangeOptions.option2.max) {
        setSelectedPriceFilter(priceRangeOptions.option2.label);
        setSelectedPriceRange('price-range2');
      } else if (min === priceRangeOptions.option3.min && max === priceRangeOptions.option3.max) {
        setSelectedPriceFilter(priceRangeOptions.option3.label);
        setSelectedPriceRange('price-range3');
      } else {
        setSelectedPriceFilter(`Rp ${min.toLocaleString('id-ID')} - Rp ${max.toLocaleString('id-ID')}`);
        setSelectedPriceRange('custom');
      }
    } else {
      // Default state: "Semua Harga"
      setSelectedPriceFilter('Semua Harga');
      setSelectedPriceRange('price-all');
      setCustomMinPrice(0);
      setCustomMaxPrice(priceRangeOptions.slider.max);
    }
  }, [filters.price_min, filters.price_max, priceRangeOptions, isUserInteracting]);



  const handlePriceRangeChange = (value: string, label: string) => {
    // Mark that user is interacting to prevent useEffect override
    setIsUserInteracting(true);

    // Always update the selected state first
    setSelectedPriceRange(value);
    setSelectedPriceFilter(label);

    // Handle custom range selection differently
    if (value === 'custom') {
      // For custom range, just update state and keep dropdown open
      // Initialize custom values to current filter values or defaults
      const currentMin = filters.price_min ? parseInt(filters.price_min) : 0;
      const currentMax = filters.price_max ? parseInt(filters.price_max) : priceRangeOptions.slider.max;
      setCustomMinPrice(currentMin);
      setCustomMaxPrice(currentMax);
      // Don't close dropdown, don't apply filter yet
      return;
    }

    // For predefined ranges, update custom values and apply immediately
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

    // Reset user interaction flag so useEffect can work normally after navigation
    setIsUserInteracting(false);

    // Apply the filter by navigating with new parameters (only for predefined ranges)
    const currentParams = new URLSearchParams(window.location.search);

    if (value === 'price-all') {
      currentParams.delete('price_min');
      currentParams.delete('price_max');
    } else if (value === 'price-range1') {
      currentParams.set('price_min', priceRangeOptions.option1.min.toString());
      currentParams.set('price_max', priceRangeOptions.option1.max.toString());
    } else if (value === 'price-range2') {
      currentParams.set('price_min', priceRangeOptions.option2.min.toString());
      currentParams.set('price_max', priceRangeOptions.option2.max.toString());
    } else if (value === 'price-range3') {
      currentParams.set('price_min', priceRangeOptions.option3.min.toString());
      currentParams.set('price_max', priceRangeOptions.option3.max.toString());
    }

    router.get('/katalog', Object.fromEntries(currentParams), {
      preserveState: true,
      preserveScroll: true,
    });
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

    // Reset user interaction flag so useEffect can work normally after navigation
    setIsUserInteracting(false);

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

  const handlePerPageChange = (perPage: number) => {
    setSelectedPerPage(perPage);

    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set('per_page', perPage.toString());
    currentParams.delete('page'); // Reset to first page when changing per_page

    router.get('/katalog', Object.fromEntries(currentParams), {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handlePageChange = (url: string | null) => {
    if (url) {
      router.get(url, {}, {
        preserveState: true,
        preserveScroll: true,
      });
    }
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
    <div className="katalog-section">
      <style>{dropdownAnimationStyles}</style>
      <div className="katalog-header">
        <h1>Katalog Produk</h1>
        <hr />

        <div className="filter-price">
          <div className="filter-header">
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
              <button className="dropdown-button" onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}>
                <span className="dropdown-icon">
                  <p id="selected-price-filter" style={{ fontSize: '12px' }}>{selectedPriceFilter}</p>
                  <img
                    src="/icons/dropdown-arrow.png"
                    className={`dropdown-button-arrow ${isPriceFilterOpen ? 'rotate-180' : ''}`}
                    alt="Dropdown"
                    style={{
                      transition: 'transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                      transformOrigin: 'center'
                    }}
                  />
                </span>
              </button>

              <div
                className="price-filter-options"
                style={{
                  display: isPriceFilterOpen ? 'block' : 'none',
                  animation: isPriceFilterOpen ? 'dropdownFadeIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'dropdownFadeOut 0.25s ease-in-out',
                  transformOrigin: 'top center'
                }}
              >
                <hr />
                <div className="price-range-options">
                  <div
                    className="checkbox-item"
                    style={{
                      animation: isPriceFilterOpen ? 'bounceIn 0.5s ease-out 0.1s both' : 'none',
                      transition: 'transform 0.2s ease, background-color 0.2s ease'
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
                      transition: 'transform 0.2s ease, background-color 0.2s ease'
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
                      transition: 'transform 0.2s ease, background-color 0.2s ease'
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
                      transition: 'transform 0.2s ease, background-color 0.2s ease'
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
                      transition: 'transform 0.2s ease, background-color 0.2s ease'
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

      <div className="katalog-products">
        {products.data.map((product) => {
          const discountPercentage = getDiscountPercentage(product);
          const effectivePrice = getEffectivePrice(product);
          const isNew = isNewProduct(product);

          return (
            <div key={product.id} className="products" style={{
              position: 'relative'
            }}>
              <a href={`/detail-produk/${product.id}`}>
                <img src={getProductImage(product)} alt={product.nama_produk} />
                {discountPercentage > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    backgroundColor: 'var(--primary-color)',
                    color: 'var(--light-text)',
                    fontSize: '14px',
                    padding: '1px 1px'
                   }}>
                    <h2>{discountPercentage}%</h2>
                  </div>
                )}
                <h1>
                  {product.nama_produk}
                  {isNew && <div style={{
                    backgroundColor: 'var(--primary-color)',
                    color: 'var(--light-text)',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: 'var(--font-weight-regular)',
                    borderRadius: '4px'
                   }}>NEW</div>}
                </h1>
                {product.is_diskon && product.harga_diskon && (
                  <p className="diskon-price">{formatPrice(product.harga)}</p>
                )}
                <p>
                  {formatPrice(effectivePrice)}
                  <span>
                    <img src="/icons/shopping-cart.png" className="price-cart" alt="Cart" />
                  </span>
                </p>
              </a>
            </div>
          );
        })}
      </div>

      {products.last_page > 1 && (
        <div className="pagination">
          {products.links.map((link, index) => {
            // Skip the "Previous" and "Next" text links
            if (link.label === '&laquo; Previous' || link.label === 'Next &raquo;') {
              return null;
            }

            return (
              <button
                key={index}
                onClick={() => handlePageChange(link.url)}
                className={`page-btn ${link.active ? 'active' : ''}`}
                disabled={!link.url}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            );
          })}
        </div>
      )}

      {/* Rows per page options */}
      <div
        className="per-page-options"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          marginTop: '20px',
          fontFamily: 'var(--main-font)',
          fontSize: 'var(--font-size-small)',
          color: 'var(--grey-text)'
        }}
      >
        <span>Tampilkan:</span>
        {[8, 16, 24, 32].map((option) => (
          <button
            key={option}
            onClick={() => handlePerPageChange(option)}
            style={{
              padding: '5px 10px',
              border: selectedPerPage === option ? '2px solid var(--primary-color)' : '1px solid #D9D9D9',
              backgroundColor: selectedPerPage === option ? 'var(--primary-color)' : 'var(--secondary-color)',
              color: selectedPerPage === option ? 'var(--light-text)' : 'var(--grey-text)',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: 'var(--font-size-small)',
              fontFamily: 'var(--main-font)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (selectedPerPage !== option) {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.borderColor = 'var(--primary-color)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedPerPage !== option) {
                e.currentTarget.style.backgroundColor = 'var(--secondary-color)';
                e.currentTarget.style.borderColor = '#D9D9D9';
              }
            }}
          >
            {option}
          </button>
        ))}
        <span>produk per halaman</span>
      </div>
    </div>
  );
}
