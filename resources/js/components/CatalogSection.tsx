import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { Product } from '../types';
import { getProductImage, isNewProduct, getDiscountPercentage, getEffectivePrice, formatPrice } from '../utils/productUtils';

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
}

export default function CatalogSection({ products, filters }: CatalogSectionProps) {
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize price filter based on current filters
  useEffect(() => {
    if (filters.price_min && filters.price_max) {
      const min = parseInt(filters.price_min);
      const max = parseInt(filters.price_max);

      if (min === 0 && max === 1000000) {
        setSelectedPriceFilter('Rp 0 - Rp 1.000.000');
        setSelectedPriceRange('price-range1');
      } else if (min === 1000000 && max === 5000000) {
        setSelectedPriceFilter('Rp 1.000.000 - Rp 5.000.000');
        setSelectedPriceRange('price-range2');
      } else if (min === 5000000 && max === 10000000) {
        setSelectedPriceFilter('Rp 5.000.000 - Rp 10.000.000');
        setSelectedPriceRange('price-range3');
      } else {
        setSelectedPriceFilter(`Rp ${min.toLocaleString('id-ID')} - Rp ${max.toLocaleString('id-ID')}`);
        setSelectedPriceRange('custom');
      }
    } else {
      setSelectedPriceFilter('Semua Harga');
      setSelectedPriceRange('price-all');
    }
  }, [filters.price_min, filters.price_max]);



  const handlePriceRangeChange = (value: string, label: string) => {
    setSelectedPriceRange(value);
    setSelectedPriceFilter(label);
    setIsPriceFilterOpen(false);

    // Apply the filter by navigating with new parameters
    const currentParams = new URLSearchParams(window.location.search);

    if (value === 'price-all') {
      currentParams.delete('price_min');
      currentParams.delete('price_max');
    } else if (value === 'price-range1') {
      currentParams.set('price_min', '0');
      currentParams.set('price_max', '1000000');
    } else if (value === 'price-range2') {
      currentParams.set('price_min', '1000000');
      currentParams.set('price_max', '5000000');
    } else if (value === 'price-range3') {
      currentParams.set('price_min', '5000000');
      currentParams.set('price_max', '10000000');
    }

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
                      onChange={() => handlePriceRangeChange('price-range1', 'Rp 0 - Rp 1.000.000')}
                    />
                    <label htmlFor="price-range1" style={{ fontSize: '12px' }}>Rp 0 - Rp 1.000.000</label>
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
                      onChange={() => handlePriceRangeChange('price-range2', 'Rp 1.000.000 - Rp 5.000.000')}
                    />
                    <label htmlFor="price-range2" style={{ fontSize: '12px' }}>Rp 1.000.000 - Rp 5.000.000</label>
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
                      onChange={() => handlePriceRangeChange('price-range3', 'Rp 5.000.000 - Rp 10.000.000')}
                    />
                    <label htmlFor="price-range3" style={{ fontSize: '12px' }}>Rp 5.000.000 - Rp 10.000.000</label>
                  </div>
                </div>
                <div className="custom-price-range">
                  <div className="price-slider">
                    <div className="slider-container">
                      <div className="price-range">
                        <p>Rp. 0</p>
                        <p>Rp. 1.000.000</p>
                      </div>
                      <input
                        type="range"
                        id="price-slider"
                        min="0"
                        max="10000000"
                        step="100000"
                        style={{
                          animation: isPriceFilterOpen ? 'bounceIn 0.6s ease-out 0.5s both' : 'none',
                          transition: 'transform 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      />
                    </div>
                  </div>
                </div>
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
    </div>
  );
}
