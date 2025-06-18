import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import History from '@/components/History';
import { PageLoader } from '@/components/Loader';

export default function HistoryPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoader text="Memuat riwayat pesanan..." />;
  }

  return (
    <>
      <Head title="History -">
        <link rel="icon" href="/favicon.png" type="image/png" />
      </Head>
      <History />
    </>
  );
}
