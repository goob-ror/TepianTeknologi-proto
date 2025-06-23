import { useState } from 'react';
import Navigation from './Navigation';
import BenefitSection from './BenefitSection';
import Footer from './Footer';

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

interface HistoryProps {
  orders: Order[];
}
import { Button } from './ui/button';

const OrderItem = ({ item }: { item: OrderItem }) => {
  const handleWhatsAppContact = () => {
    const message = `Halo, saya ingin menanyakan tentang produk :- ${item.name}`;
    const whatsappUrl = `https://wa.me/62895360022327?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      className="flex gap-5 border border-gray-300 mt-5"
      style={{
        fontFamily: 'var(--main-font)'
      }}
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-[167px] h-[167px] object-contain"
      />
      <div className="flex-1 flex flex-col p-5 gap-1">
        <h2
          style={{
            fontSize: 'var(--font-size-large)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--grey-text)',
            margin: 0
          }}
        >
          {item.name}
        </h2>
        <p
          style={{
            fontSize: 'var(--font-size-medium)',
            color: 'var(--grey-text)',
            margin: 0
          }}
        >
          Rp. {item.price.toLocaleString('id-ID')}
        </p>
        <div className="product-size-order">
          <p
            style={{
              fontSize: 'var(--font-size-medium)',
              color: 'var(--grey-text)',
              textAlign: 'right',
              margin: 0
            }}
          >
            Jumlah Item: <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{item.quantity}</span>
          </p>
        </div>
        <div className="flex justify-between items-center">
          <h2
            style={{
              fontSize: 'var(--font-size-large)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--grey-text)',
              margin: 0
            }}
          >
            Total: <span style={{ color: 'var(--primary-color)' }}>Rp. {item.subtotal.toLocaleString('id-ID')}</span>
          </h2>
          <Button
            onClick={handleWhatsAppContact}
            className="flex items-center gap-2 px-5 py-2.5 text-white border-none cursor-pointer"
            style={{
              backgroundColor: '#25D366',
              fontFamily: 'var(--main-font)',
              fontSize: 'var(--font-size-medium)'
            }}
          >
            <img
              src="/logo/WhatsApp-White-Logo.png"
              alt="WhatsApp"
              className="w-[30px] h-[30px]"
            />
            <span>Hubungi Admin</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

const OrderGroup = ({ order }: { order: Order }) => {
  // Get status color based on order status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'menunggu':
        return '#FFA500'; // Orange
      case 'dibayar':
        return '#007BFF'; // Blue
      case 'dikirim':
        return '#6F42C1'; // Purple
      case 'selesai':
        return '#28a745'; // Green
      case 'dibatalkan':
        return '#DC3545'; // Red
      default:
        return '#6C757D'; // Gray
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h1
          style={{
            fontFamily: 'var(--main-font)',
            fontSize: 'var(--font-size-large)',
            fontWeight: 'var(--font-weight-semibold)',
            margin: '10px 10px',
            color: 'var(--grey-text)'
          }}
        >
          Pemesanan Tanggal : <span style={{ color: 'var(--primary-color)' }}>{order.date}</span>
        </h1>

        {/* Order Status Badge */}
        <div
          className="px-4 py-2 rounded-full text-white text-sm font-semibold"
          style={{
            backgroundColor: getStatusColor(order.raw_status),
            fontFamily: 'var(--main-font)'
          }}
        >
          {order.status_text}
        </div>
      </div>

      <hr style={{ border: '1px solid #D9D9D9', marginBottom: '20px' }} />

      {order.items.map((item) => (
        <OrderItem key={item.id} item={item} />
      ))}

      {/* Status Information Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h3
          style={{
            fontFamily: 'var(--main-font)',
            fontSize: 'var(--font-size-medium)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--grey-text)',
            marginBottom: '12px'
          }}
        >
          Status Pesanan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Payment Status */}
          <div>
            <p style={{
              margin: 0,
              fontSize: 'var(--font-size-small)',
              color: '#6C757D',
              fontFamily: 'var(--main-font)'
            }}>
              Status Pembayaran:
            </p>
            <p style={{
              margin: 0,
              fontSize: 'var(--font-size-medium)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--grey-text)',
              fontFamily: 'var(--main-font)'
            }}>
              {order.payment_status_text}
            </p>
          </div>

          {/* Shipping Status */}
          <div>
            <p style={{
              margin: 0,
              fontSize: 'var(--font-size-small)',
              color: '#6C757D',
              fontFamily: 'var(--main-font)'
            }}>
              Status Pengiriman:
            </p>
            <p style={{
              margin: 0,
              fontSize: 'var(--font-size-medium)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--grey-text)',
              fontFamily: 'var(--main-font)'
            }}>
              {order.shipping_status_text}
            </p>

            {/* Tracking Number */}
            {order.tracking_number && (
              <p style={{
                margin: '4px 0 0 0',
                fontSize: 'var(--font-size-small)',
                color: 'var(--primary-color)',
                fontFamily: 'var(--main-font)'
              }}>
                No. Resi: {order.tracking_number}
              </p>
            )}
          </div>
        </div>
      </div>

      <div
        className="flex flex-col items-end gap-2.5 mt-2.5 pb-5 border-b-2 border-gray-300"
        style={{
          fontFamily: 'var(--main-font)',
          color: 'var(--grey-text)'
        }}
      >
        <p style={{ margin: 0, fontSize: 'var(--font-size-medium)' }}>
          {order.status === 'completed' ? 'Tanggal pemesanan selesai:' : 'Tanggal pemesanan:'} <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{order.date}</span>
        </p>
        <p style={{ margin: 0, fontSize: 'var(--font-size-medium)' }}>
          Jumlah Item: <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</span> item
        </p>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
            {/* Only show "Pesanan Selesai" status when order is actually completed */}
            {order.raw_status === 'selesai' ? (
              <div
                className="px-5 py-2.5 text-white border-none"
                style={{
                  backgroundColor: '#28a745',
                  fontFamily: 'var(--main-font)',
                  fontSize: 'var(--font-size-medium)',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>✓</span>
                <span>Pesanan Selesai</span>
              </div>
            ) : order.raw_status === 'dibatalkan' ? (
              <div
                className="px-5 py-2.5 text-white border-none"
                style={{
                  backgroundColor: '#DC3545',
                  fontFamily: 'var(--main-font)',
                  fontSize: 'var(--font-size-medium)',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>✗</span>
                <span>Pesanan Dibatalkan</span>
              </div>
            ) : (
              <div
                className="px-5 py-2.5 text-white border-none"
                style={{
                  backgroundColor: getStatusColor(order.raw_status),
                  fontFamily: 'var(--main-font)',
                  fontSize: 'var(--font-size-medium)',
                  borderRadius: '4px'
                }}
              >
                {order.status_text}
              </div>
            )}

            {/* Download Transaction Proof Button */}
            <a
              href={`/order/${order.id}/transaction-proof`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-white border-none cursor-pointer flex items-center gap-2"
              style={{
                backgroundColor: '#007BFF',
                fontFamily: 'var(--main-font)',
                fontSize: 'var(--font-size-small)',
                borderRadius: '4px',
                textDecoration: 'none'
              }}
              title="Download Bukti Transaksi"
            >
              <span>📄</span>
              <span>Bukti Transaksi</span>
            </a>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: 'var(--font-size-large)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--grey-text)'
            }}
          >
            Total: <span style={{ color: 'var(--primary-color)' }}>Rp. {order.total.toLocaleString('id-ID')}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default function History({ orders }: HistoryProps) {
  const [activeTab, setActiveTab] = useState<'processing' | 'completed'>('processing');

  // Filter orders based on tab, but exclude cancelled orders from processing tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'processing') {
      return order.status === 'processing' && order.raw_status !== 'dibatalkan';
    } else {
      return order.status === 'completed' || order.raw_status === 'dibatalkan';
    }
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--secondary-color)' }}>
      <Navigation />
      <BenefitSection />

      <main
        className="flex flex-col gap-8 p-8 mx-25 my-12"
        style={{
          backgroundColor: 'var(--secondary-color)',
          margin: '50px 100px 30px 100px'
        }}
      >
        {/* Tab Selection */}
        <div className="flex justify-center items-center mx-5">
          <Button
            onClick={() => setActiveTab('processing')}
            className={`w-[550px] px-5 py-2.5 border border-r-0 rounded-l-[20px] rounded-r-none transition-all duration-200 ${
              activeTab === 'processing'
                ? 'text-white'
                : 'text-[#FA766A]'
            }`}
            style={{
              backgroundColor: activeTab === 'processing' ? 'var(--primary-color)' : 'var(--secondary-color)',
              borderColor: 'var(--primary-color)',
              fontFamily: 'var(--main-font)',
              fontSize: 'var(--font-size-medium)',
              fontWeight: 'var(--font-weight-semibold)'
            }}
          >
            Daftar Pesanan
          </Button>
          <Button
            onClick={() => setActiveTab('completed')}
            className={`w-[550px] px-5 py-2.5 border border-l-0 rounded-r-[20px] rounded-l-none transition-all duration-200 ${
              activeTab === 'completed'
                ? 'text-white'
                : 'text-[#FA766A]'
            }`}
            style={{
              backgroundColor: activeTab === 'completed' ? 'var(--primary-color)' : 'var(--secondary-color)',
              borderColor: 'var(--primary-color)',
              fontFamily: 'var(--main-font)',
              fontSize: 'var(--font-size-medium)',
              fontWeight: 'var(--font-weight-semibold)'
            }}
          >
            Riwayat Pesanan
          </Button>
        </div>

        {/* Orders Section */}
        <section className="mx-20">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderGroup key={order.id} order={order} />
            ))
          ) : (
            <div
              className="text-center py-12"
              style={{
                fontFamily: 'var(--main-font)',
                fontSize: 'var(--font-size-large)',
                color: 'var(--grey-text)'
              }}
            >
              {activeTab === 'processing'
                ? 'Tidak ada pesanan yang sedang diproses'
                : 'Tidak ada pesanan yang selesai atau dibatalkan'}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
