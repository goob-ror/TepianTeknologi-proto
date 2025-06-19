<?php

namespace App\Models;

use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;

class Cart
{
    private const SESSION_KEY = 'shopping_cart';

    /**
     * Get the cart storage key for the current user
     */
    private static function getStorageKey(): string
    {
        if (Auth::check()) {
            return 'cart_user_' . Auth::id();
        }
        return self::SESSION_KEY;
    }

    /**
     * Get all cart items
     * Note: For authenticated users, this should be called from frontend with localStorage
     */
    public static function getItems(): array
    {
        return Session::get(self::getStorageKey(), []);
    }

    /**
     * Add item to cart
     */
    public static function addItem(int $productId, int $quantity = 1): void
    {
        $cart = self::getItems();

        if (isset($cart[$productId])) {
            $cart[$productId]['quantity'] += $quantity;
        } else {
            $product = Product::findOrFail($productId);
            $cart[$productId] = [
                'product_id' => $productId,
                'quantity' => $quantity,
                'product' => [
                    'id' => $product->id,
                    'nama_produk' => $product->nama_produk,
                    'harga' => $product->harga,
                    'harga_diskon' => $product->harga_diskon,
                    'is_diskon' => $product->is_diskon,
                    'gambar' => $product->gambar,
                    'stok' => $product->stok,
                    'category' => $product->category->nama_kategori ?? 'Uncategorized',
                ]
            ];
        }

        Session::put(self::getStorageKey(), $cart);
    }

    /**
     * Update item quantity in cart
     */
    public static function updateItem(int $productId, int $quantity): void
    {
        $cart = self::getItems();

        if (isset($cart[$productId])) {
            if ($quantity <= 0) {
                unset($cart[$productId]);
            } else {
                $cart[$productId]['quantity'] = $quantity;
            }
            Session::put(self::getStorageKey(), $cart);
        }
    }

    /**
     * Remove item from cart
     */
    public static function removeItem(int $productId): void
    {
        $cart = self::getItems();

        if (isset($cart[$productId])) {
            unset($cart[$productId]);
            Session::put(self::getStorageKey(), $cart);
        }
    }

    /**
     * Clear all cart items
     */
    public static function clear(): void
    {
        Session::forget(self::getStorageKey());
    }

    /**
     * Sync cart from localStorage data (for authenticated users)
     */
    public static function syncFromLocalStorage(array $cartData): void
    {
        if (Auth::check()) {
            Session::put(self::getStorageKey(), $cartData);
        }
    }

    /**
     * Get user ID for localStorage key (frontend use)
     */
    public static function getUserId(): ?int
    {
        return Auth::check() ? Auth::id() : null;
    }

    /**
     * Get cart total price
     */
    public static function getTotalPrice(): float
    {
        $cart = self::getItems();
        $total = 0;

        foreach ($cart as $item) {
            $price = $item['product']['is_diskon'] && $item['product']['harga_diskon']
                ? $item['product']['harga_diskon']
                : $item['product']['harga'];
            $total += $price * $item['quantity'];
        }

        return $total;
    }

    /**
     * Get cart total items count
     */
    public static function getTotalItems(): int
    {
        $cart = self::getItems();
        return array_sum(array_column($cart, 'quantity'));
    }

    /**
     * Check if cart is empty
     */
    public static function isEmpty(): bool
    {
        return empty(self::getItems());
    }

    /**
     * Get cart items formatted for checkout
     */
    public static function getFormattedItems(): array
    {
        $cart = self::getItems();
        $formattedItems = [];

        foreach ($cart as $item) {
            $product = $item['product'];
            $price = $product['is_diskon'] && $product['harga_diskon']
                ? $product['harga_diskon']
                : $product['harga'];

            $formattedItems[] = [
                'id' => (string)$product['id'],
                'name' => $product['nama_produk'],
                'price' => (float)$price,
                'quantity' => $item['quantity'],
                'image' => $product['gambar'] ? '/storage/' . $product['gambar'] : '/icons/product.png',
                'category' => $product['category'],
                'checked' => false,
                'stock' => $product['stok'],
                'original_price' => (float)$product['harga'],
                'is_discount' => $product['is_diskon'],
            ];
        }

        return $formattedItems;
    }
}
