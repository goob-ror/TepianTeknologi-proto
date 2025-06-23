<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Kategori;
use App\Models\Brand;
use App\Models\User;
use App\Models\Pesanan;
use App\Models\DetailPesanan;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProductController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function dashboard()
    {
        // Get statistics
        $totalUsers = User::count();
        $totalProducts = Product::count();
        $totalCategories = Kategori::count();
        $totalBrands = Brand::count();

        // Get low stock products (stock < 10)
        $lowStockProducts = Product::with(['category', 'brand'])
            ->where('stok', '<', 10)
            ->orderBy('stok', 'asc')
            ->limit(5)
            ->get();

        // Get recent products
        $recentProducts = Product::with(['category', 'brand'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Calculate real monthly sales data from database
        $salesData = $this->getMonthlySalesData();

        // Get additional dashboard statistics
        $totalOrders = Pesanan::count();
        $dailySales = Pesanan::whereIn('status', ['dibayar', 'dikirim', 'selesai'])
            ->whereDate('created_at', today())
            ->sum('total_harga');
        $pendingOrders = Pesanan::where('status', 'menunggu')->count();
        $completedOrders = Pesanan::where('status', 'selesai')->count();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalProducts' => $totalProducts,
                'totalCategories' => $totalCategories,
                'totalBrands' => $totalBrands,
                'totalOrders' => $totalOrders,
                'dailySales' => $dailySales,
                'pendingOrders' => $pendingOrders,
                'completedOrders' => $completedOrders,
            ],
            'lowStockProducts' => $lowStockProducts,
            'recentProducts' => $recentProducts,
            'salesData' => $salesData,
        ]);
    }

    /**
     * Display a listing of the products.
     */
    public function index(Request $request)
    {
        $query = Product::with(['category', 'brand']);

        // Search by product name
        if ($request->filled('search')) {
            $query->where('nama_produk', 'like', '%' . $request->search . '%');
        }

        // Filter by category
        if ($request->filled('category_id')) {
            $query->where('kategori_id', $request->category_id);
        }

        // Filter by brand
        if ($request->filled('brand_id')) {
            $query->where('brand_id', $request->brand_id);
        }

        // Filter by stock status
        if ($request->filled('stock_status')) {
            switch ($request->stock_status) {
                case 'out_of_stock':
                    $query->where('stok', 0);
                    break;
                case 'low_stock':
                    $query->where('stok', '>', 0)->where('stok', '<=', 10);
                    break;
                case 'in_stock':
                    $query->where('stok', '>', 10);
                    break;
            }
        }

        // Filter by active status
        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        // Sort by specified column or default to ID (ascending order)
        $sortBy = $request->get('sort_by', 'id');
        $sortOrder = $request->get('sort_order', 'asc');

        $allowedSortColumns = ['id', 'nama_produk', 'harga', 'stok', 'created_at'];
        if (in_array($sortBy, $allowedSortColumns)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('id', 'asc');
        }

        $products = $query->paginate(10)->withQueryString();

        // Get categories and brands for filter dropdowns
        $categories = Kategori::orderBy('nama_kategori')->get();
        $brands = Brand::orderBy('nama_brand')->get();

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
            'filters' => [
                'search' => $request->search,
                'category_id' => $request->category_id,
                'brand_id' => $request->brand_id,
                'stock_status' => $request->stock_status,
                'status' => $request->status,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create()
    {
        $categories = Kategori::orderBy('nama_kategori')->get();
        $brands = Brand::orderBy('nama_brand')->get();

        return Inertia::render('admin/products/create', [
            'categories' => $categories,
            'brands' => $brands,
        ]);
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_produk' => 'required|string|max:150',
            'deskripsi' => 'nullable|string',
            'harga' => 'required|numeric|min:0',
            'stok' => 'required|integer|min:0',
            'kategori_id' => 'required|exists:kategori_produk,id',
            'brand_id' => 'required|exists:brand_produk,id',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'is_active' => 'boolean',
            'is_diskon' => 'boolean',
            'discount_type' => 'nullable|string|in:price,percentage',
            'harga_diskon' => 'nullable|numeric|min:0|lt:harga',
            'diskon_persen' => 'nullable|integer|min:1|max:99',
        ]);

        // Custom validation for discount fields
        if ($request->is_diskon) {
            $discountType = $request->discount_type ?? 'price';

            if ($discountType === 'price') {
                $validator->after(function ($validator) use ($request) {
                    if (!$request->harga_diskon || $request->harga_diskon <= 0) {
                        $validator->errors()->add('harga_diskon', 'Discount price is required when using manual price discount.');
                    }
                    if ($request->harga_diskon >= $request->harga) {
                        $validator->errors()->add('harga_diskon', 'Discount price must be less than original price.');
                    }
                });
            } elseif ($discountType === 'percentage') {
                $validator->after(function ($validator) use ($request) {
                    if (!$request->diskon_persen || $request->diskon_persen <= 0) {
                        $validator->errors()->add('diskon_persen', 'Discount percentage is required when using percentage discount.');
                    }
                });
            }
        }

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        // Process discount data based on discount type
        $discountData = $this->processDiscountData($request);

        $data = [
            'nama_produk' => $request->nama_produk,
            'deskripsi' => $request->deskripsi,
            'harga' => $request->harga,
            'stok' => $request->stok,
            'kategori_id' => $request->kategori_id,
            'brand_id' => $request->brand_id,
            'is_active' => $request->boolean('is_active', true),
            'is_diskon' => $request->boolean('is_diskon', false),
            'harga_diskon' => $discountData['harga_diskon'],
            'diskon_persen' => $discountData['diskon_persen'],
        ];

        // Handle image upload
        if ($request->hasFile('gambar')) {
            $imagePath = $request->file('gambar')->store('products', 'public');
            $data['gambar'] = $imagePath;
        }

        Product::create($data);

        return redirect()->route('admin.products.index')
            ->with('success', 'Produk berhasil ditambahkan.');
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product)
    {
        $product->load(['category', 'brand']);

        return Inertia::render('admin/products/show', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(Product $product)
    {
        $categories = Kategori::orderBy('nama_kategori')->get();
        $brands = Brand::orderBy('nama_brand')->get();
        $product->load(['category', 'brand']);

        return Inertia::render('admin/products/edit', [
            'product' => $product,
            'categories' => $categories,
            'brands' => $brands,
        ]);
    }

    /**
     * Update the specified product in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validator = Validator::make($request->all(), [
            'nama_produk' => 'required|string|max:150',
            'deskripsi' => 'nullable|string',
            'harga' => 'required|numeric|min:0',
            'stok' => 'required|integer|min:0',
            'kategori_id' => 'required|exists:kategori_produk,id',
            'brand_id' => 'required|exists:brand_produk,id',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'is_active' => 'boolean',
            'is_diskon' => 'boolean',
            'discount_type' => 'nullable|string|in:price,percentage',
            'harga_diskon' => 'nullable|numeric|min:0|lt:harga',
            'diskon_persen' => 'nullable|integer|min:1|max:99',
        ]);

        // Custom validation for discount fields
        if ($request->is_diskon) {
            $discountType = $request->discount_type ?? 'price';

            if ($discountType === 'price') {
                $validator->after(function ($validator) use ($request) {
                    if (!$request->harga_diskon || $request->harga_diskon <= 0) {
                        $validator->errors()->add('harga_diskon', 'Discount price is required when using manual price discount.');
                    }
                    if ($request->harga_diskon >= $request->harga) {
                        $validator->errors()->add('harga_diskon', 'Discount price must be less than original price.');
                    }
                });
            } elseif ($discountType === 'percentage') {
                $validator->after(function ($validator) use ($request) {
                    if (!$request->diskon_persen || $request->diskon_persen <= 0) {
                        $validator->errors()->add('diskon_persen', 'Discount percentage is required when using percentage discount.');
                    }
                });
            }
        }

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        // Process discount data based on discount type
        $discountData = $this->processDiscountData($request);

        $data = [
            'nama_produk' => $request->nama_produk,
            'deskripsi' => $request->deskripsi,
            'harga' => $request->harga,
            'stok' => $request->stok,
            'kategori_id' => $request->kategori_id,
            'brand_id' => $request->brand_id,
            'is_active' => $request->boolean('is_active', true),
            'is_diskon' => $request->boolean('is_diskon', false),
            'harga_diskon' => $discountData['harga_diskon'],
            'diskon_persen' => $discountData['diskon_persen'],
        ];

        // Handle image upload
        if ($request->hasFile('gambar')) {
            // Delete old image if exists
            if ($product->gambar && Storage::disk('public')->exists($product->gambar)) {
                Storage::disk('public')->delete($product->gambar);
            }

            $imagePath = $request->file('gambar')->store('products', 'public');
            $data['gambar'] = $imagePath;
        }

        $product->update($data);

        return redirect()->route('admin.products.index')
            ->with('success', 'Produk berhasil diperbarui.');
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(Product $product)
    {
        // Check if product has order details
        if ($product->orderDetails()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Produk tidak dapat dihapus karena sudah ada dalam pesanan.');
        }

        // Delete image if exists
        if ($product->gambar && Storage::disk('public')->exists($product->gambar)) {
            Storage::disk('public')->delete($product->gambar);
        }

        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Produk berhasil dihapus.');
    }

    /**
     * Toggle product active status.
     */
    public function toggleStatus(Product $product)
    {
        $product->update([
            'is_active' => !$product->is_active
        ]);

        $status = $product->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return redirect()->back()
            ->with('success', "Produk berhasil {$status}.");
    }

    /**
     * Get monthly sales data for the chart.
     */
    private function getMonthlySalesData()
    {
        // Get sales data for the last 6 months
        $salesData = [];
        $currentDate = Carbon::now();

        for ($i = 5; $i >= 0; $i--) {
            $date = $currentDate->copy()->subMonths($i);
            $monthName = $date->format('M');
            $year = $date->year;
            $month = $date->month;

            // Calculate total sales for this month from completed orders
            $monthlySales = Pesanan::whereIn('status', ['dibayar', 'dikirim', 'selesai'])
                ->whereYear('created_at', $year)
                ->whereMonth('created_at', $month)
                ->sum('total_harga');

            $salesData[] = [
                'month' => $monthName,
                'sales' => (float) $monthlySales,
            ];
        }

        return $salesData;
    }

    /**
     * Get top selling products data.
     */
    private function getTopSellingProducts($limit = 5)
    {
        return DB::table('detail_pesanan')
            ->join('produk', 'detail_pesanan.produk_id', '=', 'produk.id')
            ->join('pesanan', 'detail_pesanan.pesanan_id', '=', 'pesanan.id')
            ->whereIn('pesanan.status', ['dibayar', 'dikirim', 'selesai'])
            ->select(
                'produk.nama_produk',
                DB::raw('SUM(detail_pesanan.jumlah) as total_sold'),
                DB::raw('SUM(detail_pesanan.subtotal) as total_revenue')
            )
            ->groupBy('produk.id', 'produk.nama_produk')
            ->orderBy('total_sold', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get order status distribution for charts.
     */
    private function getOrderStatusData()
    {
        return Pesanan::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'status' => ucfirst($item->status),
                    'count' => $item->count,
                ];
            });
    }

    /**
     * Process discount data based on discount type.
     */
    private function processDiscountData($request)
    {
        if (!$request->is_diskon) {
            return [
                'harga_diskon' => null,
                'diskon_persen' => null,
            ];
        }

        $discountType = $request->discount_type ?? 'price';
        $originalPrice = floatval($request->harga);

        if ($discountType === 'percentage') {
            // Calculate discount price from percentage
            $percentage = intval($request->diskon_persen);
            $discountPrice = $originalPrice * (100 - $percentage) / 100;

            return [
                'harga_diskon' => round($discountPrice, 2),
                'diskon_persen' => $percentage,
            ];
        } else {
            // Use manual discount price, calculate percentage for display
            $discountPrice = floatval($request->harga_diskon);
            $percentage = null;

            // Calculate percentage if discount price is valid
            if ($discountPrice > 0 && $discountPrice < $originalPrice) {
                $percentage = round((($originalPrice - $discountPrice) / $originalPrice) * 100);
            }

            return [
                'harga_diskon' => $discountPrice,
                'diskon_persen' => $percentage,
            ];
        }
    }
}