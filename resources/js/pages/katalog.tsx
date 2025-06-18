import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import BenefitSection from '../components/BenefitSection';
import FilterSidebar from '../components/FilterSidebar';
import CatalogSection from '../components/CatalogSection';
import { PageLoader } from '../components/Loader';

export default function Katalog() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1300);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoader text="Memuat katalog produk..." />;
  }

  return (
    <>
      <Head title="Katalog -">
        <link rel="icon" href="/favicon.png" type="image/png" />
      </Head>
      <div className="min-h-screen font-main" style={{ backgroundColor: '#EFEFEF' }}>
        <Navigation />
        <BenefitSection />

        <main>
          <div
            className="main-catalog flex gap-10"
            style={{
            margin: '80px 60px 20px 60px'
          }}
        >
          <FilterSidebar />
          <CatalogSection />
        </div>
      </main>

        <footer style={{
          backgroundColor: 'var(--primary-color)',
          padding: '20px',
          color: 'var(--light-text)'
        }}>
          <div
            className="text-center"
            style={{
              fontFamily: 'var(--main-font)',
              fontWeight: 'var(--font-weight-small)'
            }}
          >
            <p style={{ fontSize: 'large' }}>&copy; 2025 Tepian Teknologi</p>
          </div>
        </footer>
      </div>
    </>
  );
}
