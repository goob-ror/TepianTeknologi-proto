

import { Link, usePage, router } from '@inertiajs/react';
import { SharedData } from '../types';

export default function Navigation() {
  const { auth } = usePage<SharedData>().props;

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    router.post('/logout');
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
              href="https://wa.me/6285171639082"
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
              href="https://wa.me/6285171639082"
              style={{
                color: 'var(--light-text)',
                textDecoration: 'none',
                transition: 'opacity 0.2s',
                fontWeight: 'var(--font-weight-regular)'
              }}
              className="hover:opacity-80"
            >
              +62-851-7163-9082
            </a>
          </p>
          <p className="m-0 flex items-center gap-2 font-regular">|</p>
          <p className="m-0 flex items-center gap-2 font-regular">
            Email{' '}
            <a
              href="mailto:iconplus@gmail.com"
              style={{
                color: 'var(--light-text)',
                textDecoration: 'none',
                transition: 'opacity 0.2s',
                fontWeight: 'var(--font-weight-regular)'
              }}
              className="hover:opacity-80"
            >
              iconplus@gmail.com
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

        <div className="search flex relative w-[700px]">
          <input
            type="text"
            placeholder="Search Product"
            className="w-full px-6 py-4 pr-[60px] border-2 border-gray-300 rounded-full h-[46px] text-sm focus:outline-none"
            style={{
              borderColor: '#D9D9D9'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
            onBlur={(e) => e.target.style.borderColor = '#D9D9D9'}
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
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Keranjang Belanja
            </span>
          </Link>
          {auth.user ? (
            <Link href="/dashboard" className="transition-transform duration-200 hover:scale-110 relative group" title="Profil Pengguna">
              <img src="/icons/Avatar-Logo.png" alt="User" className="w-[59px] h-[56px]" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Profil Pengguna
              </span>
            </Link>
          ) : (
            <Link href="/login" className="transition-transform duration-200 hover:scale-110 relative group" title="Login">
              <img src="/icons/Avatar-Logo.png" alt="User" className="w-[59px] h-[56px]" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Login
              </span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
