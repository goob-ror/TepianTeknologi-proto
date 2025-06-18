import { useState, useEffect, useRef } from 'react';

export default function DetailProductSection() {
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

  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState('Semua Harga');
  const [selectedPriceRange, setSelectedPriceRange] = useState('price-all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handlePriceRangeChange = (value: string, label: string) => {
    setSelectedPriceRange(value);
    setSelectedPriceFilter(label);
    setIsPriceFilterOpen(false);
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
                      fontSize: 'var(--font-size-medium)',
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
                    <label htmlFor="price-all">Semua Harga</label>
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
                      onChange={() => handlePriceRangeChange('price-range1', 'Rp 0 - Rp 1.000.000')}
                    />
                    <label htmlFor="price-range1">Rp 0 - Rp 1.000.000</label>
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
                      onChange={() => handlePriceRangeChange('price-range2', 'Rp 1.000.000 - Rp 5.000.000')}
                    />
                    <label htmlFor="price-range2">Rp 1.000.000 - Rp 5.000.000</label>
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
                      onChange={() => handlePriceRangeChange('price-range3', 'Rp 5.000.000 - Rp 10.000.000')}
                    />
                    <label htmlFor="price-range3">Rp 5.000.000 - Rp 10.000.000</label>
                  </div>
                </div>
                <div className="custom-price-range">
                  <div className="price-slider">
                    <div className="slider-container">
                      <div
                        className="price-range"
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: 'var(--font-size-small)'
                        }}
                      >
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
                          transition: 'transform 0.2s ease',
                          width: '100%'
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
          <img src="/icons/product.png" alt="Product" />
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
              Nama Product
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
              <p
                className="diskon-price"
                style={{
                  fontSize: 'var(--font-size-medium)',
                  color: '#FA766A',
                  textDecoration: 'line-through',
                  margin: '0 0 10px 0'
                }}
              >
                Rp. 234.567
              </p>
              <p style={{ margin: 0 }}>Rp. 123.456</p>
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
                  30%
                </h2>
              </div>
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
                  Brand
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
                  Kategori
                </p>
              </li>
              <li
                data-label="Kode"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '5px',
                  fontSize: 'var(--font-size-medium)',
                  color: 'var(--grey-text)'
                }}
              >
                <span style={{ width: '100px', display: 'inline-block' }}>Kode</span>
                <span style={{ margin: '0 5px' }}>:</span>
                <p style={{
                  margin: 0,
                  color: 'var(--primary-color)',
                  fontWeight: 'var(--font-weight-semibold)'
                }}>
                  Kode Produk
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
            <a href="">
              <img
                src="/icons/shopping-cart.png"
                className="cart-product"
                style={{
                  width: '50px',
                  height: '45px'
                }}
                alt="Add to Cart"
              />
            </a>
            <button
              className="buy-button"
              style={{
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: 'var(--font-size-medium)',
                fontWeight: 'var(--font-weight-semibold)',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#285eff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-color)';
              }}
            >
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
