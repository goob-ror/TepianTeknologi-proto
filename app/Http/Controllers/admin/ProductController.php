<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Kategori;
use App\Models\Brand;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

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

        // Calculate monthly sales data (sample data for now)
        $salesData = [
            ['month' => 'Jan', 'sales' => 12000000],
            ['month' => 'Feb', 'sales' => 15000000],
            ['month' => 'Mar', 'sales' => 18000000],
            ['month' => 'Apr', 'sales' => 22000000],
            ['month' => 'May', 'sales' => 25000000],
            ['month' => 'Jun', 'sales' => 24500000],
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalProducts' => $totalProducts,
                'totalCategories' => $totalCategories,
                'totalBrands' => $totalBrands,
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
            'harga_diskon' => 'nullable|numeric|min:0|lt:harga',
            'diskon_persen' => 'nullable|integer|min:1|max:99',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $data = [
            'nama_produk' => $request->nama_produk,
            'deskripsi' => $request->deskripsi,
            'harga' => $request->harga,
            'stok' => $request->stok,
            'kategori_id' => $request->kategori_id,
            'brand_id' => $request->brand_id,
            'is_active' => $request->boolean('is_active', true),
            'is_diskon' => $request->boolean('is_diskon', false),
            'harga_diskon' => $request->is_diskon ? $request->harga_diskon : null,
            'diskon_persen' => $request->is_diskon ? $request->diskon_persen : null,
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
            'harga_diskon' => 'nullable|numeric|min:0|lt:harga',
            'diskon_persen' => 'nullable|integer|min:1|max:99',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $data = [
            'nama_produk' => $request->nama_produk,
            'deskripsi' => $request->deskripsi,
            'harga' => $request->harga,
            'stok' => $request->stok,
            'kategori_id' => $request->kategori_id,
            'brand_id' => $request->brand_id,
            'is_active' => $request->boolean('is_active', true),
            'is_diskon' => $request->boolean('is_diskon', false),
            'harga_diskon' => $request->is_diskon ? $request->harga_diskon : null,
            'diskon_persen' => $request->is_diskon ? $request->diskon_persen : null,
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
}