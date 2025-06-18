import { useState } from 'react';
import Navigation from './Navigation';
import BenefitSection from './BenefitSection';
import Footer from './Footer';
import { Button } from './ui/button';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  total: number;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  totalItems: number;
  totalPrice: number;
  status: 'processing' | 'completed';
}

// Mock data for demonstration
const mockOrders: Order[] = [
  // Processing Orders
  {
    id: '1',
    date: '15/10/2025',
    status: 'processing',
    totalItems: 4,
    totalPrice: 1000000,
    items: [
      {
        id: '1',
        name: 'Router Mikrotik RB750Gr3',
        price: 850000,
        quantity: 2,
        image: '/icons/product.png',
        total: 1700000
      },
      {
        id: '2',
        name: 'Switch TP-Link 24 Port',
        price: 650000,
        quantity: 1,
        image: '/icons/product.png',
        total: 650000
      }
    ]
  },
  {
    id: '2',
    date: '12/10/2025',
    status: 'processing',
    totalItems: 3,
    totalPrice: 2500000,
    items: [
      {
        id: '3',
        name: 'Access Point Ubiquiti',
        price: 1200000,
        quantity: 2,
        image: '/icons/product.png',
        total: 2400000
      },
      {
        id: '4',
        name: 'Kabel UTP Cat6 100m',
        price: 450000,
        quantity: 1,
        image: '/icons/product.png',
        total: 450000
      }
    ]
  },
  // Completed Orders
  {
    id: '3',
    date: '08/10/2025',
    status: 'completed',
    totalItems: 5,
    totalPrice: 3200000,
    items: [
      {
        id: '5',
        name: 'Server Dell PowerEdge T40',
        price: 2800000,
        quantity: 1,
        image: '/icons/product.png',
        total: 2800000
      },
      {
        id: '6',
        name: 'RAM DDR4 16GB',
        price: 800000,
        quantity: 2,
        image: '/icons/product.png',
        total: 1600000
      },
      {
        id: '7',
        name: 'SSD 1TB Samsung',
        price: 1200000,
        quantity: 1,
        image: '/icons/product.png',
        total: 1200000
      }
    ]
  },
  {
    id: '4',
    date: '05/10/2025',
    status: 'completed',
    totalItems: 2,
    totalPrice: 1800000,
    items: [
      {
        id: '8',
        name: 'Firewall Fortinet FortiGate',
        price: 1500000,
        quantity: 1,
        image: '/icons/product.png',
        total: 1500000
      },
      {
        id: '9',
        name: 'Patch Panel 24 Port',
        price: 300000,
        quantity: 1,
        image: '/icons/product.png',
        total: 300000
      }
    ]
  },
  {
    id: '5',
    date: '01/10/2025',
    status: 'completed',
    totalItems: 3,
    totalPrice: 2100000,
    items: [
      {
        id: '10',
        name: 'Laptop Lenovo ThinkPad',
        price: 1800000,
        quantity: 1,
        image: '/icons/product.png',
        total: 1800000
      },
      {
        id: '11',
        name: 'Mouse Wireless Logitech',
        price: 150000,
        quantity: 2,
        image: '/icons/product.png',
        total: 300000
      }
    ]
  }
];

const OrderItem = ({ item }: { item: OrderItem }) => {
  const handleWhatsAppContact = () => {
    const message = `Halo, saya ingin menanyakan tentang pesanan ${item.name}`;
    const whatsappUrl = `https://wa.me/6285171639082?text=${encodeURIComponent(message)}`;
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
            Total: <span style={{ color: 'var(--primary-color)' }}>Rp. {item.total.toLocaleString('id-ID')}</span>
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
  const handleOrderComplete = () => {
    // Handle order completion logic here
    console.log(`Marking order ${order.id} as complete`);
  };

  return (
    <div className="mb-8">
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
      <hr style={{ border: '1px solid #D9D9D9', marginBottom: '20px' }} />

      {order.items.map((item) => (
        <OrderItem key={item.id} item={item} />
      ))}

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
          Jumlah Item: <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{order.totalItems}</span> item
        </p>
        <div className="flex justify-between items-center w-full">
          {order.status === 'processing' ? (
            <Button
              onClick={handleOrderComplete}
              className="px-5 py-2.5 text-white border-none"
              style={{
                backgroundColor: '#FA766A',
                fontFamily: 'var(--main-font)',
                fontSize: 'var(--font-size-medium)'
              }}
            >
              Pesanan Selesai
            </Button>
          ) : (
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
          )}
          <p
            style={{
              margin: 0,
              fontSize: 'var(--font-size-large)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--grey-text)'
            }}
          >
            Total: <span style={{ color: 'var(--primary-color)' }}>Rp. {order.totalPrice.toLocaleString('id-ID')}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default function History() {
  const [activeTab, setActiveTab] = useState<'processing' | 'completed'>('processing');

  const filteredOrders = mockOrders.filter(order => order.status === activeTab);

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
            Pesanan Selesai
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
              {activeTab === 'processing' ? 'Tidak ada pesanan yang sedang diproses' : 'Tidak ada pesanan yang selesai'}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
