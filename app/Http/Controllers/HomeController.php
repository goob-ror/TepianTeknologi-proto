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
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;

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

        // Get products for "Terlaris" section based on actual sales data
        $popularProducts = $this->getTopSellingProducts(8);

        // Get products for "Diskon" section (only products with actual discounts, ordered by highest discount percentage)
        $discountProducts = $this->getDiscountProducts(8);

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
        $perPage = $request->get('per_page', 8); // Default to 8 products per page

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

        // Validate perPage to prevent abuse
        $perPage = in_array($perPage, [8, 16, 24, 32]) ? $perPage : 8;

        // Paginate results with dynamic per page count
        $products = $query->paginate($perPage)->withQueryString();

        // Get categories and brands for filters
        $categories = Kategori::orderBy('nama_kategori')->get();
        $brands = Brand::orderBy('nama_brand')->get();

        // Get the highest price for dynamic price filter
        $highestPrice = Product::active()->inStock()->max('harga') ?? 10000000;

        return Inertia::render('katalog', [
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
            'highestPrice' => $highestPrice,
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

        // Get the highest price for dynamic price filter
        $highestPrice = Product::active()->inStock()->max('harga') ?? 10000000;

        return Inertia::render('detail-produk', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'categories' => $categories,
            'brands' => $brands,
            'highestPrice' => $highestPrice,
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

                // Use the effective price (considers both discount types)
                $currentPrice = $product->effective_price;

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

    /**
     * Search products for navigation bar autocomplete.
     */
    public function searchProducts(Request $request)
    {
        $search = $request->get('q', '');

        if (strlen($search) < 2) {
            return response()->json([]);
        }

        $products = Product::with(['category', 'brand'])
            ->active()
            ->inStock()
            ->where('nama_produk', 'like', '%' . $search . '%')
            ->limit(8)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'nama_produk' => $product->nama_produk,
                    'harga' => $product->harga,
                    'harga_diskon' => $product->harga_diskon,
                    'is_diskon' => $product->is_diskon,
                    'gambar' => $product->gambar,
                    'category' => $product->category ? $product->category->nama_kategori : null,
                    'brand' => $product->brand ? $product->brand->nama_brand : null,
                ];
            });

        return response()->json($products);
    }

    /**
     * Get top selling products based on actual sales data.
     */
    private function getTopSellingProducts($limit = 8)
    {
        // Get product IDs ordered by total sales
        $topSellingProductIds = DB::table('detail_pesanan')
            ->join('pesanan', 'detail_pesanan.pesanan_id', '=', 'pesanan.id')
            ->whereIn('pesanan.status', ['dibayar', 'dikirim', 'selesai'])
            ->select('detail_pesanan.produk_id', DB::raw('SUM(detail_pesanan.jumlah) as total_sold'))
            ->groupBy('detail_pesanan.produk_id')
            ->orderBy('total_sold', 'desc')
            ->limit($limit)
            ->pluck('produk_id');

        // If no sales data exists, fallback to latest products
        if ($topSellingProductIds->isEmpty()) {
            return Product::with(['category', 'brand'])
                ->active()
                ->inStock()
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get();
        }

        // Get the actual products with their relationships, maintaining the order
        $products = Product::with(['category', 'brand'])
            ->active()
            ->inStock()
            ->whereIn('id', $topSellingProductIds)
            ->get()
            ->sortBy(function ($product) use ($topSellingProductIds) {
                return $topSellingProductIds->search($product->id);
            })
            ->values();

        // If we don't have enough top-selling products, fill with latest products
        if ($products->count() < $limit) {
            $additionalProducts = Product::with(['category', 'brand'])
                ->active()
                ->inStock()
                ->whereNotIn('id', $topSellingProductIds)
                ->orderBy('created_at', 'desc')
                ->limit($limit - $products->count())
                ->get();

            $products = $products->concat($additionalProducts);
        }

        return $products;
    }

    /**
     * Get discount products ordered by highest discount percentage.
     */
    private function getDiscountProducts($limit = 8)
    {
        // Get products with actual discounts
        $discountProducts = Product::with(['category', 'brand'])
            ->active()
            ->inStock()
            ->where('is_diskon', true)
            ->where(function($query) {
                // Must have either discount price or discount percentage
                $query->whereNotNull('harga_diskon')
                      ->orWhereNotNull('diskon_persen');
            })
            ->get()
            ->filter(function($product) {
                // Additional filter to ensure valid discount
                if ($product->diskon_persen && $product->diskon_persen > 0) {
                    return true;
                }
                if ($product->harga_diskon && $product->harga_diskon < $product->harga) {
                    return true;
                }
                return false;
            })
            ->map(function($product) {
                // Calculate discount percentage for sorting
                if ($product->diskon_persen && $product->diskon_persen > 0) {
                    $product->calculated_discount_percentage = $product->diskon_persen;
                } elseif ($product->harga_diskon && $product->harga_diskon < $product->harga) {
                    $product->calculated_discount_percentage = round((($product->harga - $product->harga_diskon) / $product->harga) * 100);
                } else {
                    $product->calculated_discount_percentage = 0;
                }
                return $product;
            })
            ->sortByDesc('calculated_discount_percentage')
            ->take($limit)
            ->values();

        return $discountProducts;
    }

    /**
     * Generate and download transaction proof PDF for user's order.
     */
    public function downloadTransactionProof(Pesanan $order)
    {
        try {
            $user = Auth::user();

            // Ensure the order belongs to the authenticated user
            if ($order->user_id !== $user->id) {
                abort(403, 'Unauthorized access to this order.');
            }

            // Load all necessary relationships
            $order->load([
                'user',
                'details.product.category',
                'details.product.brand',
                'payment',
                'shipping'
            ]);

            // Ensure storage link exists
            if (!is_link(public_path('storage'))) {
                Log::warning('Storage link not found. Run: php artisan storage:link');
            }

            // Generate PDF with options
            $pdf = Pdf::loadView('pdf.transaction-proof', compact('order'));

            // Set paper size and orientation with DomPDF options
            $pdf->setPaper('A4', 'portrait')
                ->setOptions([
                    'isHtml5ParserEnabled' => true,
                    'isPhpEnabled' => true,
                    'isRemoteEnabled' => false,
                    'defaultFont' => 'DejaVu Sans',
                    'dpi' => 150,
                    'enable_font_subsetting' => false,
                    'chroot' => public_path(),
                ]);



            // Generate filename
            $filename = 'transaction_proof_order_' . $order->id . '_' . now()->format('Y-m-d') . '.pdf';

            // Return PDF download
            return $pdf->download($filename);

        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('PDF Generation Error: ' . $e->getMessage(), [
                'order_id' => $order->id,
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString()
            ]);

            // Return error response
            return redirect()->back()->with('error', 'Failed to generate PDF: ' . $e->getMessage());
        }
    }
}
