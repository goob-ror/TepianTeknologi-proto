<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index()
    {
        $products = Product::with('category')->latest()->get();

        // Transform the products to include the category name
        $transformedProducts = $products->map(function ($product) {
            return [
                'id' => $product->id,
                'nama_produk' => $product->nama_produk,
                'brand_produk' => $product->brand_produk,
                'kategori_id' => $product->kategori_id,
                'nama_kategori' => $product->category ? $product->category->jenis_kategori : 'Uncategorized',
                'deskripsi_produk' => $product->deskripsi_produk,
                'gambar_produk' => $product->gambar_produk,
                'harga_produk' => $product->harga_produk,
                'stock_produk' => $product->stock_produk,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at,
            ];
        });

        // Get all categories for the filter dropdown
        $kategoris = Kategori::all();

        return Inertia::render('admin/product/index', [
            'products' => $transformedProducts,
            'kategoris' => $kategoris
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create()
    {
        $categories = Kategori::all();

        return Inertia::render('admin/product/create', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'nama_produk' => 'required|string|max:255',
            'brand_produk' => 'required|string|max:255',
            'kategori_id' => 'required|exists:kategoris,id',
            'deskripsi_produk' => 'nullable|string',
            'gambar_produk' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'harga_produk' => 'required|numeric|min:0',
            'stock_produk' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Handle file upload
        $imagePath = null;
        if ($request->hasFile('gambar_produk')) {
            $file = $request->file('gambar_produk');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $imagePath = $file->storeAs('products', $fileName, 'public');
        }

        // Create the product
        $product = new Product();
        $product->nama_produk = $request->nama_produk;
        $product->brand_produk = $request->brand_produk;
        $product->kategori_id = $request->kategori_id;
        $product->deskripsi_produk = $request->deskripsi_produk;
        $product->gambar_produk = $imagePath;
        $product->harga_produk = $request->harga_produk;
        $product->stock_produk = $request->stock_produk;
        $product->save();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified product.
     */
    public function show($id)
    {
        $product = Product::with('category')->findOrFail($id);

        return Inertia::render('admin/product/show', [
            'product' => $product
        ]);
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit($id)
    {
        $product = Product::findOrFail($id);
        $categories = Kategori::all();

        return Inertia::render('admin/product/edit', [
            'product' => $product,
            'categories' => $categories
        ]);
    }

    /**
     * Update the specified product in storage.
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        // Validate the request data
        $validator = Validator::make($request->all(), [
            'nama_produk' => 'required|string|max:255',
            'brand_produk' => 'required|string|max:255',
            'kategori_id' => 'required|exists:kategoris,id',
            'deskripsi_produk' => 'nullable|string',
            'gambar_produk' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'harga_produk' => 'required|numeric|min:0',
            'stock_produk' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Handle file upload if a new image is provided
        if ($request->hasFile('gambar_produk')) {
            // Delete the old image if it exists
            if ($product->gambar_produk) {
                Storage::disk('public')->delete($product->gambar_produk);
            }

            // Store the new image
            $file = $request->file('gambar_produk');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $imagePath = $file->storeAs('products', $fileName, 'public');
            $product->gambar_produk = $imagePath;
        }

        // Update the product
        $product->nama_produk = $request->nama_produk;
        $product->brand_produk = $request->brand_produk;
        $product->kategori_id = $request->kategori_id;
        $product->deskripsi_produk = $request->deskripsi_produk;
        $product->harga_produk = $request->harga_produk;
        $product->stock_produk = $request->stock_produk;
        $product->save();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        // Delete the product image if it exists
        if ($product->gambar_produk) {
            Storage::disk('public')->delete($product->gambar_produk);
        }

        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }
}
