import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import BenefitSection from '../components/BenefitSection';
import FilterSidebar from '../components/FilterSidebar';
import CatalogSection from '../components/CatalogSection';
import { PageLoader } from '../components/Loader';
import { Product, Category, Brand } from '../types';

interface KatalogProps {
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
  categories: Category[];
  brands: Brand[];
  highestPrice: number;
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

export default function Katalog({ products, categories, brands, highestPrice, filters }: KatalogProps) {
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
          <FilterSidebar
            categories={categories}
            brands={brands}
            filters={filters}
          />
          <CatalogSection
            products={products}
            filters={filters}
            highestPrice={highestPrice}
          />
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
