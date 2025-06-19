import { useState, useEffect, useCallback } from 'react';
import { CartStorage } from '../utils/cartStorage';
import { usePage } from '@inertiajs/react';

interface User {
  id: number;
  name: string;
  email: string;
}

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

export function useCart() {
  const { props } = usePage();
  const user = props.auth?.user as User | undefined;
  const userId = user?.id;

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load cart from localStorage on mount and when user changes
  useEffect(() => {
    const loadCart = () => {
      const items = CartStorage.getFormattedItems(userId);
      const count = CartStorage.getTotalItems(userId);
      const price = CartStorage.getTotalPrice(userId);

      setCartItems(items);
      setTotalItems(count);
      setTotalPrice(price);
    };

    loadCart();

    // If user just logged in, migrate guest cart
    if (userId && !sessionStorage.getItem(`cart_migrated_${userId}`)) {
      CartStorage.migrateGuestCartToUser(userId);
      sessionStorage.setItem(`cart_migrated_${userId}`, 'true');
      loadCart(); // Reload after migration
    }
  }, [userId]);

  // Add item to cart
  const addToCart = useCallback(async (productData: any, quantity: number = 1) => {
    try {
      // Add to localStorage
      CartStorage.addItem(productData, quantity, userId);

      // Update state
      const items = CartStorage.getFormattedItems(userId);
      const count = CartStorage.getTotalItems(userId);
      const price = CartStorage.getTotalPrice(userId);

      setCartItems(items);
      setTotalItems(count);
      setTotalPrice(price);

      // Sync with server for authenticated users
      if (userId) {
        await CartStorage.syncWithServer(userId);
      }

      return { success: true, message: 'Produk berhasil ditambahkan ke keranjang' };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, message: 'Gagal menambahkan produk ke keranjang' };
    }
  }, [userId]);

  // Update item quantity
  const updateCartItem = useCallback(async (productId: number, quantity: number) => {
    try {
      // Update in localStorage
      CartStorage.updateItem(productId, quantity, userId);

      // Update state
      const items = CartStorage.getFormattedItems(userId);
      const count = CartStorage.getTotalItems(userId);
      const price = CartStorage.getTotalPrice(userId);

      setCartItems(items);
      setTotalItems(count);
      setTotalPrice(price);

      // Sync with server for authenticated users
      if (userId) {
        await CartStorage.syncWithServer(userId);
      }

      return { success: true, message: 'Keranjang berhasil diperbarui' };
    } catch (error) {
      console.error('Error updating cart:', error);
      return { success: false, message: 'Gagal memperbarui keranjang' };
    }
  }, [userId]);

  // Remove item from cart
  const removeFromCart = useCallback(async (productId: number) => {
    try {
      // Remove from localStorage
      CartStorage.removeItem(productId, userId);

      // Update state
      const items = CartStorage.getFormattedItems(userId);
      const count = CartStorage.getTotalItems(userId);
      const price = CartStorage.getTotalPrice(userId);

      setCartItems(items);
      setTotalItems(count);
      setTotalPrice(price);

      // Sync with server for authenticated users
      if (userId) {
        await CartStorage.syncWithServer(userId);
      }

      return { success: true, message: 'Produk berhasil dihapus dari keranjang' };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false, message: 'Gagal menghapus produk dari keranjang' };
    }
  }, [userId]);

  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      // Clear localStorage
      CartStorage.clear(userId);

      // Update state
      setCartItems([]);
      setTotalItems(0);
      setTotalPrice(0);

      // Sync with server for authenticated users
      if (userId) {
        await CartStorage.syncWithServer(userId);
      }

      return { success: true, message: 'Keranjang berhasil dikosongkan' };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, message: 'Gagal mengosongkan keranjang' };
    }
  }, [userId]);

  // Update item checked state (for checkout)
  const updateItemChecked = useCallback((productId: string, checked: boolean) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, checked } : item
      )
    );
  }, []);

  // Update item quantity in state (for UI updates)
  const updateItemQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  return {
    cartItems,
    totalItems,
    totalPrice,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    updateItemChecked,
    updateItemQuantity,
    userId,
  };
}
