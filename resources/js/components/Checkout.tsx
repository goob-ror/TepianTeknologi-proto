import { useState, useEffect, useMemo } from 'react';
import Navigation from './Navigation';
import BenefitSection from './BenefitSection';
import Swal from 'sweetalert2';
import { router } from '@inertiajs/react';
import { useCart } from '../hooks/useCart';
import { usePage } from '@inertiajs/react';
import type { SharedData } from '../types';

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





interface ProductItemProps {
  item: CartItem;
  onQuantityChange: (id: string, newQuantity: number) => void;
  onCheckboxChange: (id: string, checked: boolean) => void;
  onRemove: (id: string) => void;
}

const ProductItem = ({ item, onQuantityChange, onCheckboxChange, onRemove }: ProductItemProps) => {
  const handleWhatsAppContact = () => {
    const message = `Halo, saya ingin menanyakan tentang produk :- ${item.name}`;
    const whatsappUrl = `https://wa.me/62895360022327?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleRemove = () => {
    Swal.fire({
      title: 'Hapus Produk?',
      text: `Hapus "${item.name}" dari keranjang?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280'
    }).then((result) => {
      if (result.isConfirmed) {
        onRemove(item.id);
        Swal.fire({
          title: 'Dihapus!',
          text: 'Produk berhasil dihapus',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const handleQuantityChange = async (change: number) => {
    const newQuantity = Math.max(1, item.quantity + change);

    // Check stock limit
    if (newQuantity > item.stock) {
      Swal.fire({
        title: 'Stok Tidak Mencukupi',
        text: `Stok tersedia: ${item.stock}`,
        icon: 'warning',
        confirmButtonText: 'OK',
        background: 'var(--secondary-color)',
      });
      return;
    }

    // Update quantity directly through the parent handler
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
      {/* Product Checkbox and Remove Button */}
      <div className="flex flex-col justify-around items-center pt-6 pl-4 pb-6">
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

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-red-600"
          style={{
            width: '24px',
            height: '24px',
            backgroundColor: '#dc2626',
            border: 'none',
            borderRadius: '50%',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Hapus dari keranjang"
        >
          ×
        </button>
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
  onRemove: (id: string) => void;
  isChecked: boolean;
  onCategoryCheckboxChange: (category: string, checked: boolean) => void;
}

const CategorySection = ({ title, items, onQuantityChange, onProductCheckboxChange, onRemove, isChecked, onCategoryCheckboxChange }: CategorySectionProps) => {
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
            onRemove={onRemove}
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
  isProcessingOrder: boolean;
}

const OrderSummary = ({ totalItems, totalPrice, onPayNow, isProcessingOrder }: OrderSummaryProps) => {
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
        {totalItems === 0 && (
          <p
            style={{
              fontSize: 'var(--font-size-small)',
              color: 'var(--grey-text)',
              margin: '5px 0 0 0',
              fontStyle: 'italic',
              opacity: 0.7
            }}
          >
            Pilih item untuk melihat ringkasan
          </p>
        )}
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
          disabled={totalItems === 0 || isProcessingOrder}
          className="flex items-center justify-center transition-all duration-300 w-full"
          style={{
            backgroundColor: (totalItems === 0 || isProcessingOrder) ? '#ccc' : 'var(--primary-color)',
            color: 'var(--light-text)',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '10px',
            fontSize: 'var(--font-size-medium)',
            fontWeight: 'var(--font-weight-semibold)',
            cursor: (totalItems === 0 || isProcessingOrder) ? 'not-allowed' : 'pointer',
            opacity: (totalItems === 0 || isProcessingOrder) ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLButtonElement;
            if (totalItems > 0 && !isProcessingOrder) {
              target.style.backgroundColor = '#285eff';
            }
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLButtonElement;
            if (totalItems > 0 && !isProcessingOrder) {
              target.style.backgroundColor = 'var(--primary-color)';
            }
          }}
        >
          <p
            style={{
              margin: 0,
              color: 'var(--light-text)'
            }}
          >
            {isProcessingOrder ? 'Memproses Pesanan...' : totalItems === 0 ? 'Pilih Item Terlebih Dahulu' : 'Bayar Sekarang'}
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
    .checkout-form-popup {
      font-family: var(--main-font) !important;
      border-radius: 16px !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
      border: none !important;
      max-width: 600px !important;
      width: 90% !important;
    }

    .checkout-form-title {
      font-family: var(--main-font) !important;
      font-size: var(--font-size-xlarge) !important;
      font-weight: var(--font-weight-bold) !important;
      color: var(--grey-text) !important;
      margin-bottom: 0 !important;
      padding-bottom: 15px !important;
      border-bottom: 2px solid var(--primary-color) !important;
    }

    .checkout-form-confirm {
      background: var(--primary-color) !important;
      border: none !important;
      border-radius: 8px !important;
      padding: 12px 24px !important;
      font-size: var(--font-size-medium) !important;
      font-weight: var(--font-weight-semibold) !important;
      font-family: var(--main-font) !important;
      transition: all 0.3s ease !important;
    }

    .checkout-form-confirm:hover {
      background: #285eff !important;
      transform: translateY(-1px) !important;
    }

    .checkout-form-cancel {
      background: #6b7280 !important;
      border: none !important;
      border-radius: 8px !important;
      padding: 12px 24px !important;
      font-size: var(--font-size-medium) !important;
      font-weight: var(--font-weight-semibold) !important;
      font-family: var(--main-font) !important;
      transition: all 0.3s ease !important;
    }

    .checkout-form-cancel:hover {
      background: #4b5563 !important;
      transform: translateY(-1px) !important;
    }

    .checkout-success-popup {
      font-family: var(--main-font) !important;
      border-radius: 16px !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
      border: none !important;
    }

    .checkout-success-title {
      font-family: var(--main-font) !important;
      font-size: var(--font-size-xlarge) !important;
      font-weight: var(--font-weight-semibold) !important;
      color: #059669 !important;
    }

    /* Override SweetAlert2 default styles */
    .swal2-popup {
      padding: 0 !important;
    }

    .swal2-title {
      padding: 25px 25px 0 25px !important;
      margin: 0 !important;
    }

    .swal2-html-container {
      margin: 0 !important;
      padding: 0 !important;
    }

    .swal2-actions {
      padding: 20px 25px 25px 25px !important;
      margin: 0 !important;
      gap: 12px !important;
    }

    .swal2-validation-message {
      background: #fef2f2 !important;
      color: #dc2626 !important;
      border: 1px solid #fecaca !important;
      border-radius: 8px !important;
      padding: 12px !important;
      font-family: var(--main-font) !important;
      font-size: var(--font-size-medium) !important;
    }
  `;
  const { cartItems, updateItemChecked, updateItemQuantity, updateCartItem, removeCheckedItems, removeFromCart } = useCart();
  const [categoryCheckedStates, setCategoryCheckedStates] = useState<{[key: string]: boolean}>({});
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  // Get user information from session
  const { props } = usePage<SharedData>();
  const user = props.auth?.user;

  // Get unique categories from cart items - memoized to prevent infinite re-renders
  const categories = useMemo(() => {
    return [...new Set(cartItems.map(item => item.category))];
  }, [cartItems]);

  // Update category checkbox states based on individual product selections
  useEffect(() => {
    const newCategoryStates: {[key: string]: boolean} = {};

    categories.forEach(category => {
      const categoryItems = cartItems.filter(item => item.category === category);
      const allCategoryItemsChecked = categoryItems.length > 0 && categoryItems.every(item => item.checked);
      newCategoryStates[category] = allCategoryItemsChecked;
    });

    setCategoryCheckedStates(newCategoryStates);
  }, [cartItems, categories]);

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    // Update localStorage cart
    await updateCartItem(parseInt(id), newQuantity);
    // Update local state for UI
    updateItemQuantity(id, newQuantity);
  };

  const handleProductCheckboxChange = (id: string, checked: boolean) => {
    // Update local state for UI
    updateItemChecked(id, checked);
  };

  const handleCategoryCheckboxChange = (category: string, checked: boolean) => {
    // Update all items in the category
    cartItems.forEach(item => {
      if (item.category === category) {
        updateItemChecked(item.id, checked);
      }
    });
  };

  const handleRemoveItem = async (id: string) => {
    try {
      await removeFromCart(parseInt(id));
    } catch (error) {
      console.error('Error removing item from cart:', error);
      Swal.fire({
        title: 'Error',
        text: 'Gagal menghapus produk dari keranjang',
        icon: 'error',
        confirmButtonText: 'OK',
        background: 'var(--secondary-color)',
      });
    }
  };

  const handlePayNow = async () => {
    const selectedItems = cartItems.filter(item => item.checked);

    if (selectedItems.length === 0) {
      Swal.fire({
        title: 'Pilih Item',
        text: 'Silakan pilih item yang ingin dibeli',
        icon: 'warning',
        confirmButtonText: 'OK',
        background: 'var(--secondary-color)',
      });
      return;
    }

    // Get user data for pre-population
    const userName = user?.nama_lengkap || user?.name || '';
    const userPhone = user?.no_hp || '';

    // Show order form
    const { value: formValues } = await Swal.fire({
      title: 'Informasi Pengiriman',
      html: `
        <div style="
          text-align: left;
          font-family: var(--main-font);
          padding: 20px;
          background: var(--secondary-color);
        ">
          <div style="margin-bottom: 20px;">
            <label style="
              display: block;
              margin-bottom: 8px;
              font-weight: var(--font-weight-semibold);
              color: var(--grey-text);
              font-size: var(--font-size-medium);
            ">Nama Penerima * ${userName ? '<span style="color: var(--primary-color); font-size: 12px;">(dari akun Anda)</span>' : ''}</label>
            <input
              id="nama_penerima"
              value="${userName}"
              placeholder="Masukkan nama penerima"
              style="
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: var(--font-size-medium);
                font-family: var(--main-font);
                background: ${userName ? '#f9fafb' : 'white'};
                color: var(--grey-text);
                transition: border-color 0.3s ease;
                box-sizing: border-box;
                margin: 0;
              "
              onfocus="this.style.borderColor='var(--primary-color)'"
              onblur="this.style.borderColor='#e5e7eb'"
            >
          </div>
          <div style="margin-bottom: 20px;">
            <label style="
              display: block;
              margin-bottom: 8px;
              font-weight: var(--font-weight-semibold);
              color: var(--grey-text);
              font-size: var(--font-size-medium);
            ">Alamat Lengkap *</label>
            <textarea
              id="alamat"
              placeholder="Masukkan alamat lengkap"
              style="
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: var(--font-size-medium);
                font-family: var(--main-font);
                background: white;
                color: var(--grey-text);
                transition: border-color 0.3s ease;
                box-sizing: border-box;
                margin: 0;
                height: 100px;
                resize: vertical;
              "
              onfocus="this.style.borderColor='var(--primary-color)'"
              onblur="this.style.borderColor='#e5e7eb'"
            ></textarea>
          </div>
          <div style="margin-bottom: 20px;">
            <label style="
              display: block;
              margin-bottom: 8px;
              font-weight: var(--font-weight-semibold);
              color: var(--grey-text);
              font-size: var(--font-size-medium);
            ">No. HP Penerima ${userPhone ? '<span style="color: var(--primary-color); font-size: 12px;">(dari akun Anda)</span>' : ''}</label>
            <input
              id="no_hp_penerima"
              value="${userPhone}"
              placeholder="Masukkan nomor HP"
              style="
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: var(--font-size-medium);
                font-family: var(--main-font);
                background: ${userPhone ? '#f9fafb' : 'white'};
                color: var(--grey-text);
                transition: border-color 0.3s ease;
                box-sizing: border-box;
                margin: 0;
              "
              onfocus="this.style.borderColor='var(--primary-color)'"
              onblur="this.style.borderColor='#e5e7eb'"
            >
          </div>
          <div style="margin-bottom: 20px;">
            <label style="
              display: block;
              margin-bottom: 8px;
              font-weight: var(--font-weight-semibold);
              color: var(--grey-text);
              font-size: var(--font-size-medium);
            ">Catatan (Opsional)</label>
            <textarea
              id="catatan"
              placeholder="Catatan tambahan"
              style="
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: var(--font-size-medium);
                font-family: var(--main-font);
                background: white;
                color: var(--grey-text);
                transition: border-color 0.3s ease;
                box-sizing: border-box;
                margin: 0;
                height: 80px;
                resize: vertical;
              "
              onfocus="this.style.borderColor='var(--primary-color)'"
              onblur="this.style.borderColor='#e5e7eb'"
            ></textarea>
          </div>
          <div style="
            margin-top: 25px;
            padding: 20px;
            background: white;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          ">
            <h4 style="
              margin: 0 0 15px 0;
              color: var(--primary-color);
              font-size: var(--font-size-large);
              font-weight: var(--font-weight-semibold);
              font-family: var(--main-font);
            ">Ringkasan Pesanan</h4>
            <div style="
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              padding-bottom: 8px;
              border-bottom: 1px solid #f3f4f6;
            ">
              <span style="
                color: var(--grey-text);
                font-size: var(--font-size-medium);
                font-family: var(--main-font);
              ">Total Item:</span>
              <span style="
                color: var(--grey-text);
                font-size: var(--font-size-medium);
                font-weight: var(--font-weight-semibold);
                font-family: var(--main-font);
              ">${selectedItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div style="
              display: flex;
              justify-content: space-between;
              margin-bottom: 0;
            ">
              <span style="
                color: var(--grey-text);
                font-size: var(--font-size-medium);
                font-family: var(--main-font);
              ">Total Harga:</span>
              <span style="
                color: var(--primary-color);
                font-size: var(--font-size-large);
                font-weight: var(--font-weight-bold);
                font-family: var(--main-font);
              ">Rp. ${selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: isProcessingOrder ? 'Memproses...' : 'Pesan via WhatsApp',
      cancelButtonText: 'Batal',
      allowOutsideClick: !isProcessingOrder,
      allowEscapeKey: !isProcessingOrder,
      background: 'var(--secondary-color)',
      customClass: {
        popup: 'checkout-form-popup',
        title: 'checkout-form-title',
        confirmButton: 'checkout-form-confirm',
        cancelButton: 'checkout-form-cancel'
      },
      preConfirm: () => {
        const nama_penerima = (document.getElementById('nama_penerima') as HTMLInputElement).value;
        const alamat = (document.getElementById('alamat') as HTMLTextAreaElement).value;
        const no_hp_penerima = (document.getElementById('no_hp_penerima') as HTMLInputElement).value;
        const catatan = (document.getElementById('catatan') as HTMLTextAreaElement).value;

        if (!nama_penerima || !alamat) {
          Swal.showValidationMessage('Nama penerima dan alamat harus diisi');
          return false;
        }

        return {
          nama_penerima,
          alamat,
          no_hp_penerima,
          catatan
        };
      }
    });

    if (!formValues) return;

    setIsProcessingOrder(true);

    try {
      // First, create the order in the database
      const response = await fetch('/order/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          ...formValues,
          selected_items: selectedItems.map(item => ({
            product_id: parseInt(item.id),
            quantity: item.quantity,
            price: item.price
          })),
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Gagal membuat pesanan');
      }

      // Generate WhatsApp message with order ID
      const totalAmount = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const totalQty = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

      let message = `PESANAN BARU\n`;
      message += `ID Pesanan: #${data.order_id}\n\n`;
      message += `Nama Penerima: ${formValues.nama_penerima}\n`;
      message += `Alamat: ${formValues.alamat}\n`;
      if (formValues.no_hp_penerima) {
        message += `No. HP: ${formValues.no_hp_penerima}\n`;
      }
      if (formValues.catatan) {
        message += `Catatan: ${formValues.catatan}\n`;
      }
      message += `\nDETAIL PESANAN:\n`;

      selectedItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        message += `${index + 1}. ${item.name}\n`;
        message += `   Jumlah: ${item.quantity} x Rp. ${item.price.toLocaleString('id-ID')}\n`;
        message += `   Subtotal: Rp. ${itemTotal.toLocaleString('id-ID')}\n\n`;
      });

      message += `RINGKASAN PESANAN:\n`;
      message += `Total Item: ${totalQty}\n`;
      message += `Total Harga: Rp. ${totalAmount.toLocaleString('id-ID')}\n\n`;
      message += `Mohon konfirmasi pesanan ini. Terima kasih.`;

      // Open WhatsApp with the message
      const whatsappUrl = `https://wa.me/62895360022327?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      // Remove checked items from cart
      try {
        await removeCheckedItems(selectedItems);
      } catch (error) {
        console.error('Error removing items from cart:', error);
        // Continue with success message even if cart cleanup fails
      }

      // Show success message
      Swal.fire({
        title: 'Pesanan Berhasil Dibuat!',
        html: `
          <div style="text-align: center; font-family: var(--main-font);">
            <p style="color: var(--grey-text); margin: 10px 0;">ID Pesanan: #${data.order_id}</p>
            <p style="color: var(--grey-text); margin: 10px 0;">Pesanan telah disimpan dan WhatsApp akan terbuka untuk konfirmasi</p>
            <p style="color: var(--primary-color); margin: 10px 0; font-size: 14px;">Item yang dibeli telah dihapus dari keranjang</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Lihat Riwayat Pesanan',
        showCancelButton: true,
        cancelButtonText: 'Tutup',
        background: 'var(--secondary-color)',
        customClass: {
          popup: 'checkout-success-popup',
          title: 'checkout-success-title'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          router.visit('/history');
        }
        // No need to reload page anymore since cart is already updated
      });

    } catch (error) {
      console.error('Error creating order:', error);
      Swal.fire({
        title: 'Error',
        text: error instanceof Error ? error.message : 'Terjadi kesalahan saat membuat pesanan',
        icon: 'error',
        confirmButtonText: 'OK',
        background: 'var(--secondary-color)',
      });
    } finally {
      setIsProcessingOrder(false);
    }
  };

  // Calculate totals from current cart state
  const selectedItems = cartItems.filter(item => item.checked);
  const selectedTotalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const selectedTotalPrice = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
            {cartItems.length > 0 ? (
              categories.map(category => {
                const categoryItems = cartItems.filter(item => item.category === category);
                return categoryItems.length > 0 ? (
                  <CategorySection
                    key={category}
                    title={category}
                    items={categoryItems}
                    onQuantityChange={handleQuantityChange}
                    onProductCheckboxChange={handleProductCheckboxChange}
                    onRemove={handleRemoveItem}
                    isChecked={categoryCheckedStates[category] || false}
                    onCategoryCheckboxChange={handleCategoryCheckboxChange}
                  />
                ) : null;
              })
            ) : (
              <div
                className="text-center py-12"
                style={{
                  fontFamily: 'var(--main-font)',
                  fontSize: 'var(--font-size-large)',
                  color: 'var(--grey-text)'
                }}
              >
                <div className="flex flex-col items-center gap-4">
                  <img
                    src="/icons/shopping-cart.png"
                    alt="Empty Cart"
                    style={{
                      width: '80px',
                      height: '80px',
                      opacity: 0.5
                    }}
                  />
                  <p>Keranjang belanja kosong</p>
                  <p style={{ fontSize: 'var(--font-size-medium)', color: 'var(--grey-text)', opacity: 0.7 }}>
                    Silakan tambahkan produk ke keranjang terlebih dahulu
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <OrderSummary
          totalItems={selectedTotalItems}
          totalPrice={selectedTotalPrice}
          onPayNow={handlePayNow}
          isProcessingOrder={isProcessingOrder}
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
