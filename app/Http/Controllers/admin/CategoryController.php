<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Kategori;
use Inertia\Inertia;

class CategoryController extends Controller
{
    //
    public function index()
    {
        $categories = Kategori::all();
        return Inertia::render('admin/categories/index', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'jenis_kategori' => 'required|string|unique:kategoris,jenis_kategori',
        ]);

        Kategori::create($request->only('jenis_kategori'));
        return redirect()->back();
    }

    public function destroy($id)
    {
        Kategori::destroy($id);
        return redirect()->back();
    }
}
