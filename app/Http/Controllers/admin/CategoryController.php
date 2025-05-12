<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Kategori;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    /**
     * Display a listing of the categories.
     */
    public function index()
    {
        $categories = Kategori::all();
        return Inertia::render('admin/category/index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new category.
     */
    public function create()
    {
        return Inertia::render('admin/category/create');
    }

    /**
     * Store a newly created category in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'jenis_kategori' => 'required|string|max:255|unique:kategoris,jenis_kategori',
            'deskripsi' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        Kategori::create([
            'jenis_kategori' => $request->jenis_kategori,
            'deskripsi' => $request->deskripsi,
        ]);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category created successfully.');
    }

    /**
     * Show the form for editing the specified category.
     */
    public function edit($id)
    {
        $category = Kategori::findOrFail($id);

        return Inertia::render('admin/category/edit', [
            'category' => $category
        ]);
    }

    /**
     * Update the specified category in storage.
     */
    public function update(Request $request, $id)
    {
        $category = Kategori::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'jenis_kategori' => 'required|string|max:255|unique:kategoris,jenis_kategori,' . $id,
            'deskripsi' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $category->update([
            'jenis_kategori' => $request->jenis_kategori,
            'deskripsi' => $request->deskripsi,
        ]);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified category from storage.
     */
    public function destroy($id)
    {
        $category = Kategori::findOrFail($id);

        // Check if the category has associated products
        if ($category->products()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Cannot delete category because it has associated products.');
        }

        $category->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}
