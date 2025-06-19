<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Kategori;
use App\Models\Brand;
use App\Models\Cart;
use App\Models\Pesanan;
use App\Models\DetailPesanan;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    /**
     * Display the home page with products.
     */
    public function index()
    {
        // Get latest products (for "Terbaru" section)
        $latestProducts = Product::with(['category', 'brand'])
            ->active()
            ->inStock()
            ->orderBy('created_at', 'desc')
            ->limit(8)
            ->get();

        // Get products for "Terlaris" section (for now, we'll use random products)
        // In the future, this could be based on sales data
        $popularProducts = Product::with(['category', 'brand'])
            ->active()
            ->inStock()
            ->inRandomOrder()
            ->limit(8)
            ->get();

        // Get products for "Diskon" section (products with actual discounts)
        $discountProducts = Product::with(['category', 'brand'])
            ->active()
            ->inStock()
            ->onDiscount()
            ->orderBy('created_at', 'desc')
            ->limit(8)
            ->get();

        // If no discount products, fallback to regular products for display
        if ($discountProducts->count() < 8) {
            $fallbackProducts = Product::with(['category', 'brand'])
                ->active()
                ->inStock()
                ->whereNotIn('id', $discountProducts->pluck('id'))
                ->inRandomOrder()
                ->limit(8 - $discountProducts->count())
                ->get();

            $discountProducts = $discountProducts->concat($fallbackProducts);
        }

        return Inertia::render('home', [
            'latestProducts' => $latestProducts->toArray(),
            'popularProducts' => $popularProducts->toArray(),
            'discountProducts' => $discountProducts->toArray(),
        ]);
    }

    /**
     * Display the katalog page with products, categories, and brands.
     */
    public function katalog(Request $request)
    {
        // Get filter parameters
        $categoryId = $request->get('category_id');
        $brandId = $request->get('brand_id');
        $priceMin = $request->get('price_min');
        $priceMax = $request->get('price_max');
        $search = $request->get('search');
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        // Build the query
        $query = Product::with(['category', 'brand'])
            ->active()
            ->inStock();

        // Apply filters
        if ($categoryId && $categoryId !== 'all') {
            $query->where('kategori_id', $categoryId);
        }

        if ($brandId && $brandId !== 'all') {
            $query->where('brand_id', $brandId);
        }

        if ($priceMin) {
            $query->where('harga', '>=', $priceMin);
        }

        if ($priceMax) {
            $query->where('harga', '<=', $priceMax);
        }

        if ($search) {
            $query->where('nama_produk', 'like', '%' . $search . '%');
        }

        // Apply sorting
        $query->orderBy($sortBy, $sortOrder);

        // Paginate results (8 products per page for 2 rows × 4 columns layout)
        $products = $query->paginate(8)->withQueryString();

        // Get categories and brands for filters
        $categories = Kategori::orderBy('nama_kategori')->get();
        $brands = Brand::orderBy('nama_brand')->get();

        return Inertia::render('katalog', [
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
            'filters' => [
                'category_id' => $categoryId,
                'brand_id' => $brandId,
                'price_min' => $priceMin,
                'price_max' => $priceMax,
                'search' => $search,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Display the detail produk page with categories and brands for filter sidebar.
     */
    public function detailProduk($id)
    {
        // Get the specific product with its category and brand
        $product = Product::with(['category', 'brand'])
            ->active()
            ->findOrFail($id);

        // Get related products from same category and brand (excluding current product)
        $relatedProducts = Product::with(['category', 'brand'])
            ->active()
            ->inStock()
            ->where('id', '!=', $product->id)
            ->where(function($query) use ($product) {
                $query->where('kategori_id', $product->kategori_id)
                      ->orWhere('brand_id', $product->brand_id);
            })
            ->orderBy('kategori_id', $product->kategori_id ? 'desc' : 'asc') // Prioritize same category
            ->orderBy('brand_id', $product->brand_id ? 'desc' : 'asc') // Then same brand
            ->limit(10)
            ->get();

        // If no related products found, fallback to "Terlaris" (popular products)
        if ($relatedProducts->count() < 10) {
            $fallbackProducts = Product::with(['category', 'brand'])
                ->active()
                ->inStock()
                ->where('id', '!=', $product->id)
                ->whereNotIn('id', $relatedProducts->pluck('id'))
                ->inRandomOrder() // For now, use random products as "popular"
                ->limit(10 - $relatedProducts->count())
                ->get();

            $relatedProducts = $relatedProducts->concat($fallbackProducts);
        }

        // Get categories and brands for filter sidebar
        $categories = Kategori::orderBy('nama_kategori')->get();
        $brands = Brand::orderBy('nama_brand')->get();

        return Inertia::render('detail-produk', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'categories' => $categories,
            'brands' => $brands,
            'filters' => [
                'category_id' => null,
                'brand_id' => null,
                'price_min' => null,
                'price_max' => null,
                'search' => null,
                'sort_by' => 'created_at',
                'sort_order' => 'desc',
            ],
        ]);
    }

    /**
     * Display the history page with user's orders.
     */
    public function history()
    {
        $user = Auth::user();

        // Get user's orders with details and products
        $orders = Pesanan::with(['details.product.category', 'payment', 'shipping'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        // Format orders for frontend
        $formattedOrders = $orders->map(function ($order) {
            // Determine if order is processing or completed based on actual status
            $isCompleted = $order->status === 'selesai';

            // Get status display text
            $statusText = match($order->status) {
                'menunggu' => 'Menunggu Pembayaran',
                'dibayar' => 'Sudah Dibayar',
                'dikirim' => 'Sedang Dikirim',
                'selesai' => 'Selesai',
                'dibatalkan' => 'Dibatalkan',
                default => 'Status Tidak Diketahui'
            };

            return [
                'id' => $order->id,
                'date' => $order->created_at->format('d/m/Y'),
                'status' => $isCompleted ? 'completed' : 'processing',
                'raw_status' => $order->status,
                'status_text' => $statusText,
                'total' => $order->total_harga,
                'items' => $order->details->map(function ($detail) {
                    return [
                        'id' => $detail->product->id,
                        'name' => $detail->product->nama_produk,
                        'price' => $detail->harga_satuan,
                        'quantity' => $detail->jumlah,
                        'image' => $detail->product->gambar ? '/storage/' . $detail->product->gambar : '/icons/product.png',
                        'category' => $detail->product->category->nama_kategori ?? 'Uncategorized',
                        'subtotal' => $detail->subtotal,
                    ];
                })->toArray(),
                'payment_status' => $order->payment->status ?? 'menunggu_validasi',
                'payment_status_text' => match($order->payment->status ?? 'menunggu_validasi') {
                    'menunggu_validasi' => 'Menunggu Validasi',
                    'valid' => 'Pembayaran Valid',
                    'tidak_valid' => 'Pembayaran Tidak Valid',
                    default => 'Status Pembayaran Tidak Diketahui'
                },
                'shipping_status' => $order->shipping->status_kirim ?? 'belum_dikirim',
                'shipping_status_text' => match($order->shipping->status_kirim ?? 'belum_dikirim') {
                    'belum_dikirim' => 'Belum Dikirim',
                    'dikirim' => 'Sudah Dikirim',
                    'dalam_perjalanan' => 'Dalam Perjalanan',
                    'sampai' => 'Sudah Sampai',
                    default => 'Status Pengiriman Tidak Diketahui'
                },
                'tracking_number' => $order->shipping->nomor_resi ?? null,
            ];
        });

        return Inertia::render('history', [
            'orders' => $formattedOrders->toArray(),
        ]);
    }

    /**
     * Display the checkout page with cart items.
     */
    public function checkout()
    {
        // For localStorage implementation, we'll pass empty arrays
        // The frontend will load cart data from localStorage
        return Inertia::render('checkout', [
            'cartItems' => [],
            'totalPrice' => 0,
            'totalItems' => 0,
            'userId' => Auth::id(),
        ]);
    }

    /**
     * Add product to cart.
     */
    public function addToCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:produk,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);

        // Check if enough stock
        if ($product->stok < $request->quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Stok tidak mencukupi. Stok tersedia: ' . $product->stok,
            ], 400);
        }

        Cart::addItem($request->product_id, $request->quantity);

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil ditambahkan ke keranjang',
            'cart_count' => Cart::getTotalItems(),
        ]);
    }

    /**
     * Update cart item quantity.
     */
    public function updateCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:produk,id',
            'quantity' => 'required|integer|min:0',
        ]);

        if ($request->quantity > 0) {
            $product = Product::findOrFail($request->product_id);

            // Check if enough stock
            if ($product->stok < $request->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stok tidak mencukupi. Stok tersedia: ' . $product->stok,
                ], 400);
            }
        }

        Cart::updateItem($request->product_id, $request->quantity);

        return response()->json([
            'success' => true,
            'message' => 'Keranjang berhasil diperbarui',
            'cart_count' => Cart::getTotalItems(),
            'total_price' => Cart::getTotalPrice(),
        ]);
    }

    /**
     * Remove item from cart.
     */
    public function removeFromCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:produk,id',
        ]);

        Cart::removeItem($request->product_id);

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil dihapus dari keranjang',
            'cart_count' => Cart::getTotalItems(),
            'total_price' => Cart::getTotalPrice(),
        ]);
    }

    /**
     * Clear all cart items.
     */
    public function clearCart()
    {
        Cart::clear();

        return response()->json([
            'success' => true,
            'message' => 'Keranjang berhasil dikosongkan',
        ]);
    }

    /**
     * Sync cart data from localStorage.
     */
    public function syncCart(Request $request)
    {
        $request->validate([
            'cartData' => 'required|array',
        ]);

        try {
            Cart::syncFromLocalStorage($request->cartData);

            return response()->json([
                'success' => true,
                'message' => 'Keranjang berhasil disinkronkan',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyinkronkan keranjang',
            ], 500);
        }
    }

    /**
     * Create order from cart items.
     */
    public function createOrder(Request $request)
    {
        $request->validate([
            'nama_penerima' => 'required|string|max:100',
            'alamat' => 'required|string',
            'no_hp_penerima' => 'nullable|string|max:20',
            'catatan' => 'nullable|string',
            'selected_items' => 'required|array|min:1',
            'selected_items.*.product_id' => 'required|exists:produk,id',
            'selected_items.*.quantity' => 'required|integer|min:1',
            'selected_items.*.price' => 'required|numeric|min:0',
        ]);

        $user = Auth::user();
        $selectedItems = $request->selected_items;

        if (empty($selectedItems)) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada item yang dipilih',
            ], 400);
        }

        DB::beginTransaction();

        try {
            // Calculate total price for selected items
            $totalPrice = 0;
            foreach ($selectedItems as $item) {
                $totalPrice += $item['price'] * $item['quantity'];
            }

            // Create order
            $order = Pesanan::create([
                'user_id' => $user->id,
                'nama_penerima' => $request->nama_penerima,
                'alamat' => $request->alamat,
                'no_hp_penerima' => $request->no_hp_penerima,
                'catatan' => $request->catatan,
                'status' => 'menunggu',
                'total_harga' => $totalPrice,
            ]);

            // Create order details
            foreach ($selectedItems as $item) {
                $product = Product::findOrFail($item['product_id']);

                // Check stock availability
                if ($product->stok < $item['quantity']) {
                    throw new \Exception("Stok tidak mencukupi untuk produk: {$product->nama_produk}");
                }

                // Use the price from the frontend (which should match the current product price)
                $currentPrice = $product->is_diskon && $product->harga_diskon
                    ? $product->harga_diskon
                    : $product->harga;

                DetailPesanan::create([
                    'pesanan_id' => $order->id,
                    'produk_id' => $item['product_id'],
                    'jumlah' => $item['quantity'],
                    'harga_satuan' => $currentPrice, // Use current price for consistency
                ]);

                // Update product stock
                $product->decrement('stok', $item['quantity']);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pesanan berhasil dibuat',
                'order_id' => $order->id,
            ]);

        } catch (\Exception $e) {
            DB::rollback();

            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat pesanan: ' . $e->getMessage(),
            ], 500);
        }
    }
}
