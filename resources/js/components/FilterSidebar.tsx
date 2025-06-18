import { useState } from 'react';

interface FilterSidebarProps {
  height?: string;
}

export default function FilterSidebar({ height = '850px' }: FilterSidebarProps) {
  // Enhanced CSS animations for filter dropdowns
  const filterAnimationStyles = `
    @keyframes filterSlideIn {
      0% {
        opacity: 0;
        transform: translateY(-10px) scale(0.95);
        max-height: 0;
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
        max-height: 300px;
      }
    }

    @keyframes filterSlideOut {
      0% {
        opacity: 1;
        transform: translateY(0) scale(1);
        max-height: 300px;
      }
      100% {
        opacity: 0;
        transform: translateY(-10px) scale(0.95);
        max-height: 0;
      }
    }

    @keyframes itemFadeIn {
      0% {
        opacity: 0;
        transform: translateX(-15px) scale(0.9);
      }
      100% {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
    }

    @keyframes checkboxPop {
      0% {
        transform: scale(0.8);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
  `;

  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (categoryId === 'all-category') {
      setSelectedCategories(checked ? ['all-category'] : []);
    } else {
      setSelectedCategories(prev => {
        const newCategories = checked
          ? [...prev.filter(id => id !== 'all-category'), categoryId]
          : prev.filter(id => id !== categoryId);
        return newCategories;
      });
    }
  };

  const handleBrandChange = (brandId: string, checked: boolean) => {
    if (brandId === 'all-brand') {
      setSelectedBrands(checked ? ['all-brand'] : []);
    } else {
      setSelectedBrands(prev => {
        const newBrands = checked
          ? [...prev.filter(id => id !== 'all-brand'), brandId]
          : prev.filter(id => id !== brandId);
        return newBrands;
      });
    }
  };

  return (
    <aside
      className="w-75 p-5 shadow-lg"
      style={{
        backgroundColor: 'var(--secondary-color)',
        height: height
      }}
    >
      <style>{filterAnimationStyles}</style>
      <div className="filter-content">
        <div className="filter-content-text">
          <h1>Filter</h1>
          <img src="/icons/filter.png" alt="Filter" style={{
            width: '40px',
            height: '40px',
            marginBottom: '10px'
          }}/>
          <hr style={{
            marginTop: '-10px',
            paddingTop: '-10px'
           }}/>
        </div>

        {/* Category Filter */}
        <div className="filter-checkbox kategory w-full">
          <div className="filter-header flex justify-between items-center mb-4 cursor-pointer">
            <button
              className="w-full flex justify-between items-center bg-transparent border-none p-0 cursor-pointer"
              onClick={() => toggleFilter('category')}
            >
              <h3
                className="m-0 hover:text-blue-600 transition-colors"
                style={{
                  fontFamily: 'var(--main-font)',
                  fontSize: 'var(--font-size-medium)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--grey-text)'
                }}
              >
                Kategori
              </h3>
              <span
                className={`dropdown-icon inline-block ${
                  activeFilters.includes('category') ? 'rotate-180' : ''
                }`}
                style={{
                  transition: 'transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                  transformOrigin: 'center'
                }}
              >
                <img src="/icons/dropdown-arrow.png" alt="Dropdown" />
              </span>
            </button>
          </div>
          <div
            className={`filter-options overflow-hidden ${
              activeFilters.includes('category') ? 'block' : 'hidden'
            }`}
            style={{
              animation: activeFilters.includes('category')
                ? 'filterSlideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                : 'filterSlideOut 0.25s ease-in-out',
              transformOrigin: 'top center',
              padding: activeFilters.includes('category') ? '10px 0' : '0'
            }}
          >
            <div
              className="checkbox-item flex items-center mb-3 px-1"
              style={{
                animation: activeFilters.includes('category') ? 'itemFadeIn 0.4s ease-out 0.1s both' : 'none',
                transition: 'transform 0.2s ease, background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(5px)';
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <input
                type="checkbox"
                id="all-category"
                name="category"
                checked={selectedCategories.includes('all-category')}
                onChange={(e) => handleCategoryChange('all-category', e.target.checked)}
                className="appearance-none w-4.5 h-4.5 border-2 rounded mr-2.5 cursor-pointer relative flex-shrink-0"
                style={{
                  borderColor: 'var(--primary-color)',
                  backgroundColor: selectedCategories.includes('all-category') ? 'var(--primary-color)' : 'transparent',
                  transition: 'all 0.3s ease',
                  animation: selectedCategories.includes('all-category') ? 'checkboxPop 0.3s ease' : 'none'
                }}
              />
              <label
                htmlFor="all-category"
                className="cursor-pointer flex-grow whitespace-nowrap overflow-hidden text-ellipsis hover:text-blue-600 transition-colors"
                style={{
                  fontFamily: 'var(--main-font)',
                  fontSize: 'var(--font-size-small)',
                  color: 'var(--grey-text)'
                }}
              >
                Semua Kategori
              </label>
            </div>
            <div
              className="checkbox-item flex items-center mb-3 px-1"
              style={{
                animation: activeFilters.includes('category') ? 'itemFadeIn 0.4s ease-out 0.2s both' : 'none',
                transition: 'transform 0.2s ease, background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(5px)';
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <input
                type="checkbox"
                id="ont"
                name="category"
                checked={selectedCategories.includes('ont')}
                onChange={(e) => handleCategoryChange('ont', e.target.checked)}
                className="appearance-none w-4.5 h-4.5 border-2 rounded mr-2.5 cursor-pointer relative flex-shrink-0"
                style={{
                  borderColor: 'var(--primary-color)',
                  backgroundColor: selectedCategories.includes('ont') ? 'var(--primary-color)' : 'transparent',
                  transition: 'all 0.3s ease',
                  animation: selectedCategories.includes('ont') ? 'checkboxPop 0.3s ease' : 'none'
                }}
              />
              <label
                htmlFor="ont"
                className="cursor-pointer flex-grow whitespace-nowrap overflow-hidden text-ellipsis hover:text-blue-600 transition-colors"
                style={{
                  fontFamily: 'var(--main-font)',
                  fontSize: 'var(--font-size-small)',
                  color: 'var(--grey-text)'
                }}
              >
                Optical Network Terminal
              </label>
            </div>
            <div
              className="checkbox-item flex items-center mb-0 px-1"
              style={{
                animation: activeFilters.includes('category') ? 'itemFadeIn 0.4s ease-out 0.3s both' : 'none',
                transition: 'transform 0.2s ease, background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(5px)';
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <input
                type="checkbox"
                id="olt"
                name="category"
                checked={selectedCategories.includes('olt')}
                onChange={(e) => handleCategoryChange('olt', e.target.checked)}
                className="appearance-none w-4.5 h-4.5 border-2 rounded mr-2.5 cursor-pointer relative flex-shrink-0"
                style={{
                  borderColor: 'var(--primary-color)',
                  backgroundColor: selectedCategories.includes('olt') ? 'var(--primary-color)' : 'transparent',
                  transition: 'all 0.3s ease',
                  animation: selectedCategories.includes('olt') ? 'checkboxPop 0.3s ease' : 'none'
                }}
              />
              <label
                htmlFor="olt"
                className="cursor-pointer flex-grow whitespace-nowrap overflow-hidden text-ellipsis hover:text-blue-600 transition-colors"
                style={{
                  fontFamily: 'var(--main-font)',
                  fontSize: 'var(--font-size-small)',
                  color: 'var(--grey-text)'
                }}
              >
                Optical Line Terminal
              </label>
            </div>
          </div>
        </div>

        {/* Brand Filter */}
        <div className="filter-checkbox brand w-full">
          <div className="filter-header flex justify-between items-center mb-4 cursor-pointer">
            <button
              className="w-full flex justify-between items-center bg-transparent border-none p-0 cursor-pointer"
              onClick={() => toggleFilter('brand')}
            >
              <h3
                className="m-0 hover:text-blue-600 transition-colors"
                style={{
                  fontFamily: 'var(--main-font)',
                  fontSize: 'var(--font-size-medium)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--grey-text)'
                }}
              >
                Brand
              </h3>
              <span
                className={`dropdown-icon inline-block ${
                  activeFilters.includes('brand') ? 'rotate-180' : ''
                }`}
                style={{
                  transition: 'transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                  transformOrigin: 'center'
                }}
              >
                <img src="/icons/dropdown-arrow.png" alt="Dropdown" />
              </span>
            </button>
          </div>
          <div
            className={`filter-options overflow-hidden ${
              activeFilters.includes('brand') ? 'block' : 'hidden'
            }`}
            style={{
              animation: activeFilters.includes('brand')
                ? 'filterSlideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                : 'filterSlideOut 0.25s ease-in-out',
              transformOrigin: 'top center',
              padding: activeFilters.includes('brand') ? '10px 0' : '0'
            }}
          >
            <div
              className="checkbox-item flex items-center mb-3 px-1"
              style={{
                animation: activeFilters.includes('brand') ? 'itemFadeIn 0.4s ease-out 0.1s both' : 'none',
                transition: 'transform 0.2s ease, background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(5px)';
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <input
                type="checkbox"
                id="all-brand"
                name="brand"
                checked={selectedBrands.includes('all-brand')}
                onChange={(e) => handleBrandChange('all-brand', e.target.checked)}
                className="appearance-none w-4.5 h-4.5 border-2 rounded mr-2.5 cursor-pointer relative flex-shrink-0"
                style={{
                  borderColor: 'var(--primary-color)',
                  backgroundColor: selectedBrands.includes('all-brand') ? 'var(--primary-color)' : 'transparent',
                  transition: 'all 0.3s ease',
                  animation: selectedBrands.includes('all-brand') ? 'checkboxPop 0.3s ease' : 'none'
                }}
              />
              <label
                htmlFor="all-brand"
                className="cursor-pointer flex-grow whitespace-nowrap overflow-hidden text-ellipsis hover:text-blue-600 transition-colors"
                style={{
                  fontFamily: 'var(--main-font)',
                  fontSize: 'var(--font-size-small)',
                  color: 'var(--grey-text)'
                }}
              >
                Semua Brand
              </label>
            </div>
            <div
              className="checkbox-item flex items-center mb-3 px-1"
              style={{
                animation: activeFilters.includes('brand') ? 'itemFadeIn 0.4s ease-out 0.2s both' : 'none',
                transition: 'transform 0.2s ease, background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(5px)';
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <input
                type="checkbox"
                id="cdata"
                name="brand"
                checked={selectedBrands.includes('cdata')}
                onChange={(e) => handleBrandChange('cdata', e.target.checked)}
                className="appearance-none w-4.5 h-4.5 border-2 rounded mr-2.5 cursor-pointer relative flex-shrink-0"
                style={{
                  borderColor: 'var(--primary-color)',
                  backgroundColor: selectedBrands.includes('cdata') ? 'var(--primary-color)' : 'transparent',
                  transition: 'all 0.3s ease',
                  animation: selectedBrands.includes('cdata') ? 'checkboxPop 0.3s ease' : 'none'
                }}
              />
              <label
                htmlFor="cdata"
                className="cursor-pointer flex-grow whitespace-nowrap overflow-hidden text-ellipsis hover:text-blue-600 transition-colors"
                style={{
                  fontFamily: 'var(--main-font)',
                  fontSize: 'var(--font-size-small)',
                  color: 'var(--grey-text)'
                }}
              >
                CDATA
              </label>
            </div>
            <div
              className="checkbox-item flex items-center mb-0 px-1"
              style={{
                animation: activeFilters.includes('brand') ? 'itemFadeIn 0.4s ease-out 0.3s both' : 'none',
                transition: 'transform 0.2s ease, background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(5px)';
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <input
                type="checkbox"
                id="zne"
                name="brand"
                checked={selectedBrands.includes('zne')}
                onChange={(e) => handleBrandChange('zne', e.target.checked)}
                className="appearance-none w-4.5 h-4.5 border-2 rounded mr-2.5 cursor-pointer relative flex-shrink-0"
                style={{
                  borderColor: 'var(--primary-color)',
                  backgroundColor: selectedBrands.includes('zne') ? 'var(--primary-color)' : 'transparent',
                  transition: 'all 0.3s ease',
                  animation: selectedBrands.includes('zne') ? 'checkboxPop 0.3s ease' : 'none'
                }}
              />
              <label
                htmlFor="zne"
                className="cursor-pointer flex-grow whitespace-nowrap overflow-hidden text-ellipsis hover:text-blue-600 transition-colors"
                style={{
                  fontFamily: 'var(--main-font)',
                  fontSize: 'var(--font-size-small)',
                  color: 'var(--grey-text)'
                }}
              >
                ZNE
              </label>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
