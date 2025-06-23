import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Checkout from '@/components/Checkout';
import { PageLoader } from '@/components/Loader';
import { useCart } from '@/hooks/useCart';





export default function CheckoutPage() {
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
