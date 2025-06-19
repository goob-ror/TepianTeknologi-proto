import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import History from '@/components/History';
import { PageLoader } from '@/components/Loader';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  subtotal: number;
}

interface Order {
  id: number;
  date: string;
  status: 'processing' | 'completed';
  raw_status: 'menunggu' | 'dibayar' | 'dikirim' | 'selesai' | 'dibatalkan';
  status_text: string;
  total: number;
  items: OrderItem[];
  payment_status: string;
  payment_status_text: string;
  shipping_status: string;
  shipping_status_text: string;
  tracking_number?: string;
}

interface HistoryPageProps {
  orders: Order[];
}

export default function HistoryPage({ orders }: HistoryPageProps) {
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
      <History orders={orders} />
    </>
  );
}
