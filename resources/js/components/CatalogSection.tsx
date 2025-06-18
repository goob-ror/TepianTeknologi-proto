import { useState, useEffect, useRef } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  isNew?: boolean;
  image: string;
}

export default function CatalogSection() {
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
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const productsPerPage = 8;

  const products: Product[] = [
    { id: 1, name: 'Nama Product', price: 123456, originalPrice: 234567, discount: 30, image: '/icons/product.png' },
    { id: 2, name: 'Nama Product', price: 123456, image: '/icons/product.png' },
    { id: 3, name: 'Nama Product', price: 123456, isNew: true, image: '/icons/product.png' },
    { id: 4, name: 'Nama Product', price: 150000, originalPrice: 200000, discount: 25, image: '/icons/product.png' },
    { id: 5, name: 'Nama Product', price: 450000, isNew: true, image: '/icons/product.png' },
    { id: 6, name: 'Nama Product', price: 175000, image: '/icons/product.png' },
    { id: 7, name: 'Nama Product', price: 300000, originalPrice: 500000, discount: 40, image: '/icons/product.png' },
    { id: 8, name: 'Nama Product', price: 325000, image: '/icons/product.png' },
    { id: 9, name: 'Nama Product', price: 275000, isNew: true, image: '/icons/product.png' },
    { id: 10, name: 'Nama Product', price: 340000, originalPrice: 400000, discount: 15, image: '/icons/product.png' },
    { id: 11, name: 'Nama Product', price: 225000, image: '/icons/product.png' },
    { id: 12, name: 'Nama Product', price: 350000, isNew: true, image: '/icons/product.png' },
    { id: 13, name: 'Nama Product', price: 480000, originalPrice: 600000, discount: 20, image: '/icons/product.png' },
    { id: 14, name: 'Nama Product', price: 425000, image: '/icons/product.png' },
    { id: 15, name: 'Nama Product', price: 375000, isNew: true, image: '/icons/product.png' }
  ];

  const formatPrice = (price: number) => {
    return `Rp. ${price.toLocaleString('id-ID')}`;
  };

  const handlePriceRangeChange = (value: string, label: string) => {
    setSelectedPriceRange(value);
    setSelectedPriceFilter(label);
    setIsPriceFilterOpen(false);
  };

  // Calculate pagination
  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
                  <p id="selected-price-filter">{selectedPriceFilter}</p>
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
                    <label htmlFor="price-all">Semua Harga</label>
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
                    <label htmlFor="price-range1">Rp 0 - Rp 1.000.000</label>
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
                    <label htmlFor="price-range2">Rp 1.000.000 - Rp 5.000.000</label>
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
                    <label htmlFor="price-range3">Rp 5.000.000 - Rp 10.000.000</label>
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
        {currentProducts.map((product) => (
          <div key={product.id} className="products" style={{
            position: 'relative'
          }}>
            <a href="">
              <img src={product.image} alt={product.name} />
              {product.discount && (
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  backgroundColor: 'var(--primary-color)',
                  color: 'var(--light-text)',
                  fontSize: '14px',
                  padding: '1px 1px'
                 }}>
                  <h2>{product.discount}%</h2>
                </div>
              )}
              <h1>
                {product.name}
                {product.isNew && <div style={{
                  backgroundColor: 'var(--primary-color)',
                  color: 'var(--light-text)',
                  padding: '2px 6px',
                  fontSize: '10px',
                  fontWeight: 'var(--font-weight-regular)',
                  borderRadius: '4px'
                 }}>NEW</div>}
              </h1>
              {product.originalPrice && (
                <p className="diskon-price">{formatPrice(product.originalPrice)}</p>
              )}
              <p>
                {formatPrice(product.price)}
                <span>
                  <img src="/icons/shopping-cart.png" className="price-cart" alt="Cart" />
                </span>
              </p>
            </a>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`page-btn ${currentPage === page ? 'active' : ''}`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
