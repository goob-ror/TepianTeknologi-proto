interface CartItem {
  product_id: number;
  quantity: number;
  product: {
    id: number;
    nama_produk: string;
    harga: number;
    harga_diskon?: number;
    is_diskon: boolean;
    gambar?: string;
    stok: number;
    category: string;
  };
}

interface CartData {
  [productId: string]: CartItem;
}

export class CartStorage {
  private static getStorageKey(userId?: number): string {
    return userId ? `cart_user_${userId}` : 'cart_guest';
  }

  /**
   * Get cart items from localStorage
   */
  static getItems(userId?: number): CartData {
    if (typeof window === 'undefined') return {};

    try {
      const key = this.getStorageKey(userId);
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return {};
    }
  }

  /**
   * Save cart items to localStorage
   */
  static setItems(cartData: CartData, userId?: number): void {
    if (typeof window === 'undefined') return;

    try {
      const key = this.getStorageKey(userId);
      localStorage.setItem(key, JSON.stringify(cartData));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }

  /**
   * Add item to cart in localStorage
   */
  static addItem(productData: CartItem['product'], quantity: number = 1, userId?: number): void {
    const cart = this.getItems(userId);
    const productId = productData.id.toString();

    if (cart[productId]) {
      cart[productId].quantity += quantity;
    } else {
      cart[productId] = {
        product_id: productData.id,
        quantity,
        product: productData
      };
    }

    this.setItems(cart, userId);
  }

  /**
   * Update item quantity in cart
   */
  static updateItem(productId: number, quantity: number, userId?: number): void {
    const cart = this.getItems(userId);
    const key = productId.toString();

    if (cart[key]) {
      if (quantity <= 0) {
        delete cart[key];
      } else {
        cart[key].quantity = quantity;
      }
      this.setItems(cart, userId);
    }
  }

  /**
   * Remove item from cart
   */
  static removeItem(productId: number, userId?: number): void {
    const cart = this.getItems(userId);
    const key = productId.toString();

    if (cart[key]) {
      delete cart[key];
      this.setItems(cart, userId);
    }
  }

  /**
   * Remove multiple items from cart by product IDs
   * Used after successful checkout to remove purchased items from localStorage
   */
  static removeItems(productIds: number[], userId?: number): void {
    const cart = this.getItems(userId);

    productIds.forEach(productId => {
      const key = productId.toString();
      if (cart[key]) {
        delete cart[key];
      }
    });

    this.setItems(cart, userId);
  }

  /**
   * Clear all cart items
   */
  static clear(userId?: number): void {
    if (typeof window === 'undefined') return;

    try {
      const key = this.getStorageKey(userId);
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing cart from localStorage:', error);
    }
  }

  /**
   * Get total items count
   */
  static getTotalItems(userId?: number): number {
    const cart = this.getItems(userId);
    return Object.values(cart).reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Get total price
   */
  static getTotalPrice(userId?: number): number {
    const cart = this.getItems(userId);
    return Object.values(cart).reduce((total, item) => {
      const price = item.product.is_diskon && item.product.harga_diskon
        ? item.product.harga_diskon
        : item.product.harga;
      return total + (price * item.quantity);
    }, 0);
  }

  /**
   * Get formatted items for display
   */
  static getFormattedItems(userId?: number): any[] {
    const cart = this.getItems(userId);
    return Object.values(cart).map(item => {
      const product = item.product;
      const price = product.is_diskon && product.harga_diskon
        ? product.harga_diskon
        : product.harga;

      return {
        id: product.id.toString(),
        name: product.nama_produk,
        price: parseFloat(price.toString()),
        quantity: item.quantity,
        image: product.gambar ? `/storage/${product.gambar}` : '/icons/product.png',
        category: product.category,
        checked: false,
        stock: product.stok,
        original_price: parseFloat(product.harga.toString()),
        is_discount: product.is_diskon,
      };
    });
  }

  /**
   * Migrate guest cart to user cart when user logs in
   */
  static migrateGuestCartToUser(userId: number): void {
    const guestCart = this.getItems(); // Get guest cart
    const userCart = this.getItems(userId); // Get existing user cart

    // Merge guest cart into user cart
    Object.keys(guestCart).forEach(productId => {
      if (userCart[productId]) {
        // If product exists in user cart, add quantities
        userCart[productId].quantity += guestCart[productId].quantity;
      } else {
        // If product doesn't exist in user cart, add it
        userCart[productId] = guestCart[productId];
      }
    });

    // Save merged cart to user storage
    this.setItems(userCart, userId);

    // Clear guest cart
    this.clear();
  }

  /**
   * Sync cart data with server (for backup/restore)
   */
  static async syncWithServer(userId?: number): Promise<void> {
    if (!userId) return;

    try {
      const cartData = this.getItems(userId);

      await fetch('/cart/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ cartData }),
      });
    } catch (error) {
      console.error('Error syncing cart with server:', error);
    }
  }
}
