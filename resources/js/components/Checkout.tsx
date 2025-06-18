import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import BenefitSection from './BenefitSection';
import Swal from 'sweetalert2';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  checked: boolean;
}

// Static dummy data
const initialCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Router Mikrotik RB750Gr3',
    price: 850000,
    quantity: 2,
    image: '/icons/product.png',
    category: 'Optical Network Terminal',
    checked: false
  },
  {
    id: '2',
    name: 'Switch TP-Link 24 Port',
    price: 650000,
    quantity: 1,
    image: '/icons/product.png',
    category: 'Optical Network Terminal',
    checked: false
  },
  {
    id: '3',
    name: 'ONT Huawei HG8245H5',
    price: 450000,
    quantity: 1,
    image: '/icons/product.png',
    category: 'Optical Network Terminal',
    checked: false
  },
  {
    id: '4',
    name: 'Access Point Ubiquiti UniFi',
    price: 1200000,
    quantity: 1,
    image: '/icons/product.png',
    category: 'Optical Line Terminal',
    checked: false
  },
  {
    id: '5',
    name: 'OLT ZTE C320',
    price: 2500000,
    quantity: 1,
    image: '/icons/product.png',
    category: 'Optical Line Terminal',
    checked: false
  },
  {
    id: '6',
    name: 'Fiber Optic Cable 100m',
    price: 750000,
    quantity: 2,
    image: '/icons/product.png',
    category: 'Optical Line Terminal',
    checked: false
  }
];

interface ProductItemProps {
  item: CartItem;
  onQuantityChange: (id: string, newQuantity: number) => void;
  onCheckboxChange: (id: string, checked: boolean) => void;
}

const ProductItem = ({ item, onQuantityChange, onCheckboxChange }: ProductItemProps) => {
  const handleWhatsAppContact = () => {
    const message = `Halo, saya ingin menanyakan tentang produk ${item.name}`;
    const whatsappUrl = `https://wa.me/6285171639082?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, item.quantity + change);
    onQuantityChange(item.id, newQuantity);
  };

  const total = item.price * item.quantity;

  return (
    <div
      className="flex gap-5 border border-gray-300"
      style={{
        fontFamily: 'var(--main-font)'
      }}
    >
      {/* Product Checkbox */}
      <div className="flex items-center justify-center pt-6 pl-4">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            checked={item.checked}
            onChange={(e) => onCheckboxChange(item.id, e.target.checked)}
            className="cursor-pointer transition-all duration-300 hover:scale-105"
            style={{
              appearance: 'none',
              WebkitAppearance: 'none',
              width: '24px',
              height: '24px',
              border: '2px solid var(--primary-color)',
              borderRadius: '5px',
              backgroundColor: item.checked ? 'var(--primary-color)' : 'transparent',
              boxShadow: item.checked ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'
            }}
          />
          {item.checked && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -60%) rotate(45deg)',
                width: '6px',
                height: '12px',
                border: 'solid white',
                borderWidth: '0 3px 3px 0'
              }}
            />
          )}
        </div>
      </div>

      <img
        src={item.image}
        alt={item.name}
        className="object-contain"
        style={{
          height: '185px'
        }}
      />
      <div
        className="flex-1 flex flex-col p-5 gap-4"
        style={{
          fontFamily: 'var(--main-font)'
        }}
      >
        <h1
          style={{
            fontSize: 'var(--font-size-medium)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--grey-text)',
            margin: 0
          }}
        >
          {item.name}
        </h1>
        <p
          style={{
            fontSize: 'var(--font-size-small)',
            color: 'var(--primary-color)',
            fontWeight: 'var(--font-weight-semibold)',
            margin: 0
          }}
        >
          Rp. {item.price.toLocaleString('id-ID')}
        </p>

        <div
          className="flex items-center justify-end gap-2.5"
          style={{
            fontFamily: 'var(--main-font)'
          }}
        >
          <p
            style={{
              color: 'var(--grey-text)',
              fontSize: 'var(--font-size-small)',
              margin: 0
            }}
          >
            Jumlah Item:
          </p>
          <div className="flex items-center">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-blue-600 hover:text-white hover:border-blue-600"
              style={{
                width: '30px',
                height: '30px',
                border: '1px solid #D9D9D9',
                backgroundColor: 'var(--grey-text)',
                fontSize: 'var(--font-size-small)',
                color: 'var(--light-text)'
              }}
            >
              -
            </button>
            <input
              type="number"
              value={item.quantity}
              readOnly
              className="text-center"
              style={{
                width: '30px',
                height: '30px',
                border: '1px solid #D9D9D9',
                fontSize: 'var(--font-size-small)',
                color: 'var(--grey-text)',
                MozAppearance: 'textfield',
                WebkitAppearance: 'none'
              }}
            />
            <button
              onClick={() => handleQuantityChange(1)}
              className="flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-blue-600 hover:text-white hover:border-blue-600"
              style={{
                width: '30px',
                height: '30px',
                border: '1px solid #D9D9D9',
                backgroundColor: 'var(--grey-text)',
                fontSize: 'var(--font-size-small)',
                color: 'var(--light-text)'
              }}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-5">
          <h2
            style={{
              fontSize: 'var(--font-size-medium)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--grey-text)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            Total: <span style={{ color: 'var(--primary-color)' }}>Rp. {total.toLocaleString('id-ID')}</span>
          </h2>
          <button
            onClick={handleWhatsAppContact}
            className="flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-blue-800"
            style={{
              backgroundColor: 'var(--primary-color)',
              color: 'var(--light-text)',
              border: 'none',
              padding: '2px 10px',
              borderRadius: '10px',
              fontSize: 'var(--font-size-small)',
              fontWeight: 'var(--font-weight-semibold)'
            }}
          >
            <img
              src="/logo/WhatsApp-White-Logo.png"
              alt="WhatsApp"
              style={{
                width: '20px',
                height: '20px'
              }}
            />
            <p
              style={{
                color: 'var(--light-text)',
                margin: 0,
                fontSize: 'var(--font-size-small)',
                fontWeight: 'var(--font-weight-semibold)'
              }}
            >
              Tanya Produk?
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

interface CategorySectionProps {
  title: string;
  items: CartItem[];
  onQuantityChange: (id: string, newQuantity: number) => void;
  onProductCheckboxChange: (id: string, checked: boolean) => void;
  isChecked: boolean;
  onCategoryCheckboxChange: (category: string, checked: boolean) => void;
}

const CategorySection = ({ title, items, onQuantityChange, onProductCheckboxChange, isChecked, onCategoryCheckboxChange }: CategorySectionProps) => {
  return (
    <div
      className="w-full mb-8"
      style={{
        fontFamily: 'var(--main-font)'
      }}
    >
      <div className="flex flex-col gap-2.5 mb-5">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => onCategoryCheckboxChange(title, e.target.checked)}
              className="cursor-pointer transition-all duration-300 hover:scale-105"
              style={{
                appearance: 'none',
                WebkitAppearance: 'none',
                width: '22px',
                height: '22px',
                border: '2px solid var(--primary-color)',
                borderRadius: '5px',
                backgroundColor: isChecked ? 'var(--primary-color)' : 'transparent',
                boxShadow: isChecked ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'
              }}
            />
            {isChecked && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -60%) rotate(45deg)',
                  width: '5px',
                  height: '10px',
                  border: 'solid white',
                  borderWidth: '0 2px 2px 0'
                }}
              />
            )}
          </div>
          <h1
            style={{
              fontSize: 'var(--font-size-xlarge)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--grey-text)',
              margin: 0
            }}
          >
            {title}
          </h1>
        </div>
        <hr
          style={{
            width: '100%',
            border: 'none',
            borderTop: '2px solid #D9D9D9',
            margin: 0
          }}
        />
      </div>

      <div className="flex flex-col gap-5">
        {items.map((item) => (
          <ProductItem
            key={item.id}
            item={item}
            onQuantityChange={onQuantityChange}
            onCheckboxChange={onProductCheckboxChange}
          />
        ))}
      </div>
    </div>
  );
};

interface OrderSummaryProps {
  totalItems: number;
  totalPrice: number;
  onPayNow: () => void;
}

const OrderSummary = ({ totalItems, totalPrice, onPayNow }: OrderSummaryProps) => {
  return (
    <aside
      className="bg-white shadow-lg p-5 h-fit"
      style={{
        width: '300px',
        backgroundColor: 'var(--secondary-color)',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        margin: '40px 0 0 0',
        fontFamily: 'var(--main-font)'
      }}
    >
      <div className="flex flex-col gap-5">
        <h1
          style={{
            fontSize: 'var(--font-size-large)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--grey-text)',
            margin: 0
          }}
        >
          Ringkasan Pesanan
        </h1>
        <hr
          style={{
            width: '100%',
            border: 'none',
            borderTop: '2px solid #D9D9D9',
            margin: 0
          }}
        />

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <p
              style={{
                margin: 0,
                fontSize: 'var(--font-size-medium)',
                color: 'var(--grey-text)'
              }}
            >
              Total Item
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 'var(--font-size-medium)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--primary-color)'
              }}
            >
              {totalItems}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <p
              style={{
                margin: 0,
                fontSize: 'var(--font-size-medium)',
                color: 'var(--grey-text)'
              }}
            >
              Total Harga
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 'var(--font-size-medium)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--primary-color)'
              }}
            >
              Rp. {totalPrice.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        <button
          onClick={onPayNow}
          className="flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-blue-800 w-full"
          style={{
            backgroundColor: 'var(--primary-color)',
            color: 'var(--light-text)',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '10px',
            fontSize: 'var(--font-size-medium)',
            fontWeight: 'var(--font-weight-semibold)'
          }}
        >
          <p
            style={{
              margin: 0,
              color: 'var(--light-text)'
            }}
          >
            Bayar Sekarang
          </p>
        </button>
      </div>
    </aside>
  );
};

export default function Checkout() {
  // Add CSS to hide webkit spin buttons and style scrollbar
  const customStyles = `
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Custom scrollbar styling */
    .checkout-scroll::-webkit-scrollbar {
      width: 8px;
    }

    .checkout-scroll::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    .checkout-scroll::-webkit-scrollbar-thumb {
      background: var(--primary-color);
      border-radius: 4px;
    }

    .checkout-scroll::-webkit-scrollbar-thumb:hover {
      background: #285eff;
    }

    /* Firefox scrollbar styling */
    .checkout-scroll {
      scrollbar-width: thin;
      scrollbar-color: var(--primary-color) #f1f1f1;
    }

    /* SweetAlert2 Custom Styling */
    .checkout-payment-popup {
      font-family: var(--main-font) !important;
      border-radius: 15px !important;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
      border: 2px solid var(--primary-color) !important;
    }

    .checkout-payment-title {
      font-family: var(--main-font) !important;
      font-size: var(--font-size-xlarge) !important;
      font-weight: var(--font-weight-semibold) !important;
      color: var(--primary-color) !important;
      margin-bottom: 10px !important;
    }

    .checkout-success-popup {
      font-family: var(--main-font) !important;
      border-radius: 15px !important;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
      border: 2px solid #28a745 !important;
    }

    .checkout-success-title {
      font-family: var(--main-font) !important;
      font-size: var(--font-size-xlarge) !important;
      font-weight: var(--font-weight-semibold) !important;
      color: #28a745 !important;
    }

    /* Override SweetAlert2 default styles */
    .swal2-popup {
      padding: 30px !important;
    }

    .swal2-title {
      padding: 0 !important;
      margin: 0 0 20px 0 !important;
    }

    .swal2-html-container {
      margin: 0 !important;
      padding: 0 !important;
    }
  `;
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [ontChecked, setOntChecked] = useState(false);
  const [oltChecked, setOltChecked] = useState(false);

  // Update category checkbox states based on individual product selections
  useEffect(() => {
    const ontItems = cartItems.filter(item => item.category === 'Optical Network Terminal');
    const oltItems = cartItems.filter(item => item.category === 'Optical Line Terminal');

    // Check if all ONT items are selected
    const allOntChecked = ontItems.length > 0 && ontItems.every(item => item.checked);
    setOntChecked(allOntChecked);

    // Check if all OLT items are selected
    const allOltChecked = oltItems.length > 0 && oltItems.every(item => item.checked);
    setOltChecked(allOltChecked);
  }, [cartItems]);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleProductCheckboxChange = (id: string, checked: boolean) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, checked } : item
      )
    );
  };

  const handleCategoryCheckboxChange = (category: string, checked: boolean) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.category === category ? { ...item, checked } : item
      )
    );
  };

  const handlePayNow = () => {
    Swal.fire({
      title: 'Memproses Pembayaran...',
      html: `
        <div style="text-align: center; font-family: var(--main-font);">
          <div style="margin: 20px 0;">
            <div style="
              width: 50px;
              height: 50px;
              border: 4px solid #f3f3f3;
              border-top: 4px solid var(--primary-color);
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin: 0 auto;
            "></div>
          </div>
          <p style="
            color: var(--grey-text);
            font-size: var(--font-size-medium);
            margin: 15px 0 5px 0;
            font-weight: var(--font-weight-medium);
            animation: pulse 2s ease-in-out infinite;
          ">
            Sedang mengarahkan ke halaman pembayaran...
          </p>
          <p style="
            color: var(--primary-color);
            font-size: var(--font-size-small);
            margin: 0;
            font-weight: var(--font-weight-semibold);
          ">
            Total: Rp. ${totalPrice.toLocaleString('id-ID')}
          </p>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        </style>
      `,
      showConfirmButton: false,
      showCancelButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      background: 'var(--secondary-color)',
      customClass: {
        popup: 'checkout-payment-popup',
        title: 'checkout-payment-title'
      },
      didOpen: () => {
        // Auto close after 3 seconds and redirect
        setTimeout(() => {
          Swal.close();
          // Here you would typically redirect to actual payment gateway
          // For demo purposes, we'll show a success message
          setTimeout(() => {
            Swal.fire({
              title: 'Berhasil!',
              text: 'Anda akan diarahkan ke halaman pembayaran',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000,
              background: 'var(--secondary-color)',
              customClass: {
                popup: 'checkout-success-popup',
                title: 'checkout-success-title'
              }
            });
          }, 500);
        }, 3000);
      }
    });
  };

  // Group items by category
  const ontItems = cartItems.filter(item => item.category === 'Optical Network Terminal');
  const oltItems = cartItems.filter(item => item.category === 'Optical Line Terminal');

  // Calculate totals
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--secondary-color)' }}
    >
      <style>{customStyles}</style>
      <Navigation />
      <BenefitSection />

      <main
        className="flex justify-between gap-8"
        style={{
          fontFamily: 'var(--main-font)',
          padding: '0 30px',
          marginTop: '20px',
          height: 'calc(100vh - 250px)', // Adjust based on header/footer height
          overflow: 'hidden'
        }}
      >
        <section
          className="flex-1 max-w-6xl mx-auto flex gap-8"
          style={{
            backgroundColor: 'var(--secondary-color)',
            margin: '40px auto',
            padding: '30px',
            height: '100%',
            overflow: 'hidden'
          }}
        >
          <div
            className="flex-1 checkout-scroll"
            style={{
              height: '100%',
              overflowY: 'auto',
              paddingRight: '10px'
            }}
          >
            {ontItems.length > 0 && (
              <CategorySection
                title="Optical Network Terminal"
                items={ontItems}
                onQuantityChange={handleQuantityChange}
                onProductCheckboxChange={handleProductCheckboxChange}
                isChecked={ontChecked}
                onCategoryCheckboxChange={handleCategoryCheckboxChange}
              />
            )}

            {oltItems.length > 0 && (
              <CategorySection
                title="Optical Line Terminal"
                items={oltItems}
                onQuantityChange={handleQuantityChange}
                onProductCheckboxChange={handleProductCheckboxChange}
                isChecked={oltChecked}
                onCategoryCheckboxChange={handleCategoryCheckboxChange}
              />
            )}
          </div>
        </section>

        <OrderSummary
          totalItems={totalItems}
          totalPrice={totalPrice}
          onPayNow={handlePayNow}
        />
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
  );
}
