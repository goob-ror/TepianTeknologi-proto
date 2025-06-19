import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Checkout from '@/components/Checkout';
import { PageLoader } from '@/components/Loader';
import { useCart } from '@/hooks/useCart';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  checked: boolean;
  stock: number;
  original_price: number;
  is_discount: boolean;
}

interface CheckoutPageProps {
  cartItems: CartItem[];
  totalPrice: number;
  totalItems: number;
  userId?: number;
}

export default function CheckoutPage({ userId }: CheckoutPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { cartItems, totalPrice, totalItems } = useCart();

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoader text="Memuat keranjang belanja..." />;
  }

  return (
    <>
      <Head title='Checkout -'>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </Head>
      <Checkout cartItems={cartItems} totalPrice={totalPrice} totalItems={totalItems} />
    </>
  );
}
