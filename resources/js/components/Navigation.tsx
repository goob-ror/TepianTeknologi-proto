
import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { SharedData } from '../types';
import { useCart } from '../hooks/useCart';

interface SearchProduct {
  id: number;
  nama_produk: string;
  harga: string;
  harga_diskon?: string;
  is_diskon?: boolean;
  gambar?: string;
  category?: string;
  brand?: string;
}

export default function Navigation() {
  const { auth } = usePage<SharedData>().props;
  const { totalItems } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    router.post('/logout');
  };

  // Search functionality
  const performSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for 1.5 seconds
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 1500);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Clear timeout and perform immediate search
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      performSearch(searchTerm);
    }
  };

  const handleProductClick = (productId: number) => {
    setShowResults(false);
    setSearchTerm('');
    router.visit(`/detail-produk/${productId}`);
  };

  const formatPrice = (price: string, discountPrice?: string, isDiscount?: boolean) => {
    const formatNumber = (num: string) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(parseFloat(num));
    };

    if (isDiscount && discountPrice) {
      return (
        <div className="flex flex-col">
          <span className="text-red-600 font-semibold">{formatNumber(discountPrice)}</span>
          <span className="text-gray-500 line-through text-sm">{formatNumber(price)}</span>
        </div>
      );
    }
    return <span className="font-semibold">{formatNumber(price)}</span>;
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Determine profile link and tooltip based on user role
  const getProfileLink = () => {
    if (!auth.user) return '/login';
    return auth.user.role === 'admin' ? '/admin/dashboard' : '/dashboard';
  };

  const getProfileTooltip = () => {
    if (!auth.user) return 'Login';
    return auth.user.role === 'admin' ? 'Admin Dashboard' : 'Profil Pengguna';
  };
  return (
    <div className="navigation flex flex-col w-full shadow-md">
      {/* Information Bar */}
      <div
        className="information flex justify-between items-center px-10 py-2"
        style={{
          backgroundColor: 'var(--primary-color)',
          fontFamily: 'var(--secondary-font)',
          fontWeight: 'var(--font-weight-regular)',
          color: 'var(--light-text)'
        }}
      >
        <div className="info-content flex items-center gap-8 max-w-[70%]">
          <p className="m-0 flex items-center gap-2 font-regular">
            Call Us{' '}
            <a
              href="https://wa.me/62895360022327"
              style={{
                color: 'var(--light-text)',
                textDecoration: 'none',
                transition: 'opacity 0.2s',
                fontWeight: 'var(--font-weight-regular)'
              }}
              className="hover:opacity-80"
            >
              0541 7802095
            </a>{' '}
            |{' '}
            <a
              href="https://wa.me/62895360022327"
              style={{
                color: 'var(--light-text)',
                textDecoration: 'none',
                transition: 'opacity 0.2s',
                fontWeight: 'var(--font-weight-regular)'
              }}
              className="hover:opacity-80"
            >
              +62-895-3600-22327
            </a>
          </p>
          <p className="m-0 flex items-center gap-2 font-regular">|</p>
          <p className="m-0 flex items-center gap-2 font-regular">
            Email{' '}
            <a
              href="mailto:tepianteknologi@citranet.com"
              style={{
                color: 'var(--light-text)',
                textDecoration: 'none',
                transition: 'opacity 0.2s',
                fontWeight: 'var(--font-weight-regular)'
              }}
              className="hover:opacity-80"
            >
              tepianteknologi@citranet.com
            </a>
          </p>
        </div>
        {auth.user ? (
          <button
            onClick={handleLogout}
            className="login-signup ml-auto hover:opacity-80 bg-transparent border-none cursor-pointer"
            style={{
              color: 'var(--light-text)',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
              fontWeight: 'var(--font-weight-regular)',
              fontSize: 'inherit',
              fontFamily: 'inherit'
            }}
          >
            Log Out
          </button>
        ) : (
          <Link
            href="/login"
            className="login-signup ml-auto hover:opacity-80"
            style={{
              color: 'var(--light-text)',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
              fontWeight: 'var(--font-weight-regular)'
            }}
          >
            Login/Sign Up
          </Link>
        )}
      </div>

      {/* Main Navigation */}
      <nav
        className="flex justify-between items-center px-10 py-4 border-b border-gray-300"
        style={{
          backgroundColor: 'var(--secondary-color)'
        }}
      >
        <div className="logo">
          <Link href="/">
            <img src="/logo/TepianTeknologi-Logo.png" alt="Logo" className="h-[43px] w-[76.44px] cursor-pointer transition-transform duration-200 hover:scale-105" />
          </Link>
        </div>

        <ul className="flex list-none gap-8">
          <li>
            <Link
              href="/"
              style={{
                color: 'var(--grey-text)',
                textDecoration: 'none',
                fontFamily: 'var(--secondary-font)',
                fontWeight: 'var(--font-weight-light)',
                fontSize: 'var(--font-size-medium)',
                transition: 'color 0.2s, font-weight 0.2s'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLAnchorElement;
                target.style.color = 'var(--primary-color)';
                target.style.fontWeight = 'var(--font-weight-bold)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLAnchorElement;
                target.style.color = 'var(--grey-text)';
                target.style.fontWeight = 'var(--font-weight-light)';
              }}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/katalog"
              style={{
                color: 'var(--grey-text)',
                textDecoration: 'none',
                fontFamily: 'var(--secondary-font)',
                fontWeight: 'var(--font-weight-light)',
                fontSize: 'var(--font-size-medium)',
                transition: 'color 0.2s, font-weight 0.2s'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLAnchorElement;
                target.style.color = 'var(--primary-color)';
                target.style.fontWeight = 'var(--font-weight-bold)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLAnchorElement;
                target.style.color = 'var(--grey-text)';
                target.style.fontWeight = 'var(--font-weight-light)';
              }}
            >
              Product
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              style={{
                color: 'var(--grey-text)',
                textDecoration: 'none',
                fontFamily: 'var(--secondary-font)',
                fontWeight: 'var(--font-weight-light)',
                fontSize: 'var(--font-size-medium)',
                transition: 'color 0.2s, font-weight 0.2s'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLAnchorElement;
                target.style.color = 'var(--primary-color)';
                target.style.fontWeight = 'var(--font-weight-bold)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLAnchorElement;
                target.style.color = 'var(--grey-text)';
                target.style.fontWeight = 'var(--font-weight-light)';
              }}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              style={{
                color: 'var(--grey-text)',
                textDecoration: 'none',
                fontFamily: 'var(--secondary-font)',
                fontWeight: 'var(--font-weight-light)',
                fontSize: 'var(--font-size-medium)',
                transition: 'color 0.2s, font-weight 0.2s'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLAnchorElement;
                target.style.color = 'var(--primary-color)';
                target.style.fontWeight = 'var(--font-weight-bold)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLAnchorElement;
                target.style.color = 'var(--grey-text)';
                target.style.fontWeight = 'var(--font-weight-light)';
              }}
            >
              Contact
            </Link>
          </li>
        </ul>

        <div className="search flex relative w-[700px]" ref={searchContainerRef}>
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <input
              type="text"
              placeholder="Search Product"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-6 py-4 pr-[60px] border-2 border-gray-300 rounded-full h-[46px] text-sm focus:outline-none"
              style={{
                borderColor: '#D9D9D9'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary-color)';
                if (searchResults.length > 0) setShowResults(true);
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#D9D9D9';
                // Delay hiding results to allow clicking on them
                setTimeout(() => setShowResults(false), 200);
              }}
            />
            <button
              type="submit"
              className="absolute right-[10px] top-1/2 transform -translate-y-1/2 rounded-full border-none cursor-pointer transition-all duration-200 px-4 py-[6px] flex items-center justify-center hover:scale-105"
              style={{
                backgroundColor: 'var(--primary-color)',
                color: 'var(--light-text)'
              }}
            >
              <img src="/icons/search.png" alt="Search" className="w-[22px] h-[22px]" />
            </button>
          </form>

          {/* Search Results Dropdown */}
          {showResults && (searchResults.length > 0 || isSearching) && (
            <div
              className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 mt-1 max-h-96 overflow-y-auto"
              style={{ borderColor: '#D9D9D9' }}
            >
              {isSearching ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                    Searching...
                  </div>
                </div>
              ) : (
                <>
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                    >
                      <div className="w-12 h-12 flex-shrink-0 mr-3">
                        <img
                          src={product.gambar ? `/storage/${product.gambar}` : '/icons/product.png'}
                          alt={product.nama_produk}
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/icons/product.png';
                          }}
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="font-medium text-gray-900 truncate text-sm">
                          {product.nama_produk}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          {product.category && <span>{product.category}</span>}
                          {product.brand && product.category && <span>•</span>}
                          {product.brand && <span>{product.brand}</span>}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right ml-3">
                        {formatPrice(product.harga, product.harga_diskon, product.is_diskon)}
                      </div>
                    </div>
                  ))}
                  {searchResults.length === 0 && searchTerm.length >= 2 && (
                    <div className="p-4 text-center text-gray-500">
                      No products found for "{searchTerm}"
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="user-actions flex gap-6 items-center">
          <Link
            href="/history"
            className="transition-transform duration-200 hover:scale-110 relative group"
            title="Riwayat Pesanan"
          >
            <img src="/icons/shopping-bag.png" alt="History" className="w-[59px] h-[49px]" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Riwayat Pesanan
            </span>
          </Link>
          <Link
            href="/checkout"
            className="transition-transform duration-200 hover:scale-110 relative group"
            title="Keranjang Belanja"
          >
            <img src="/icons/shopping-cart.png" alt="Checkout" className="w-[45px] h-[39px]" />
            {/* Cart Counter */}
            {totalItems > 0 && (
              <div
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center"
                style={{
                  fontSize: '10px',
                  lineHeight: '1',
                  padding: totalItems > 99 ? '2px 4px' : '0',
                  minWidth: totalItems > 99 ? 'auto' : '20px'
                }}
              >
                {totalItems > 99 ? '99+' : totalItems}
              </div>
            )}
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Keranjang Belanja
            </span>
          </Link>
          <Link
            href={getProfileLink()}
            className="transition-transform duration-200 hover:scale-110 relative group"
            title={getProfileTooltip()}
          >
            <img src="/icons/Avatar-Logo.png" alt="User" className="w-[59px] h-[56px]" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {getProfileTooltip()}
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
