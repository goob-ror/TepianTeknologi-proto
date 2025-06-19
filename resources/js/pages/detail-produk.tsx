import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import BenefitSection from '../components/BenefitSection';
import FilterSidebar from '../components/FilterSidebar';
import DetailProductSection from '../components/DetailProductSection';
import ProductDescription from '../components/ProductDescription';
import RelatedProducts from '../components/RelatedProducts';
import { PageLoader } from '../components/Loader';
import { Category, Brand, Product } from '../types';

interface DetailProdukProps {
  product: Product;
  relatedProducts: Product[];
  categories: Category[];
  brands: Brand[];
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

export default function DetailProduk({ product, relatedProducts, categories, brands, filters }: DetailProdukProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoader text="Memuat detail produk..." />;
  }

  return (
    <>
      <Head title={`${product.nama_produk} - Detail`}>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </Head>
      <div className="min-h-screen" style={{ backgroundColor: '#EFEFEF', fontFamily: 'Montserrat, sans-serif' }}>
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
            height="1300px"
            categories={categories}
            brands={brands}
            filters={filters}
          />
          <section className="section-detail flex flex-col">
            <DetailProductSection product={product} />
            <ProductDescription product={product} />
            <RelatedProducts products={relatedProducts} />
          </section>
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
