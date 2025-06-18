
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import ProductSection from '../components/ProductSection';
import BreakContact from '../components/BreakContact';
import SponsorSection from '../components/SponsorSection';
import Footer from '../components/Footer';
import { PageLoader } from '../components/Loader';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoader text="Memuat halaman beranda..." />;
  }

  return (
    <>
      <Head title="Market -">
        <link rel="icon" href="/favicon.png" type="image/png" />
      </Head>

      <div className="min-h-screen bg-gray-100 font-main">
        <Navigation />
        <Header />

        <main>
          {/* Bagian Terlaris */}
          <ProductSection title="Produk Terlaris" type="terlaris" />

          {/* Bagian Diskon */}
          <ProductSection title="Spesial Diskon" type="diskon" />

          {/* Bagian Terbaru */}
          <ProductSection title="Produk Terbaru" type="terbaru" />

          {/* Bagian Break Contact */}
          <BreakContact />

          {/* Bagian Sponsor */}
          <SponsorSection />
        </main>

        <Footer />
      </div>
    </>
  );
}