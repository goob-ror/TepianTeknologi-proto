<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\admin\CategoryController;
use App\Http\Controllers\admin\UserController;
use App\Http\Controllers\ProductController;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

Route::get('/katalog', function () {
    return Inertia::render('katalog');
})->name('katalog');

Route::get('/detail-produk', function () {
    return Inertia::render('detail-produk');
})->name('detail-produk');

Route::get('/history', function () {
    return Inertia::render('history');
})->name('history');

Route::get('/checkout', function () {
    return Inertia::render('checkout');
})->name('checkout');

Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('contact');
})->name('contact');

Route::middleware(['auth', 'verified', 'user'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('admin/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('admin.dashboard');
});

Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    // Category routes
    Route::get('/categories', [CategoryController::class, 'index'])->name('admin.categories.index');
    Route::get('/categories/add', [CategoryController::class, 'create'])->name('admin.categories.create');
    Route::post('/categories', [CategoryController::class, 'store'])->name('admin.categories.store');
    Route::get('/categories/{id}/edit', [CategoryController::class, 'edit'])->name('admin.categories.edit');
    Route::put('/categories/{id}', [CategoryController::class, 'update'])->name('admin.categories.update');
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy'])->name('admin.categories.destroy');

    Route::get('/users', function () {
        return Inertia::render('admin/user/index');
    });
    Route::get('/users/{id}/soft-delete', [UserController::class, 'softDelete']);
    Route::get('/users/add', function () {
        return Inertia::render('admin/user/create');
    });

    // Product routes
    Route::get('/products', [ProductController::class, 'index'])->name('admin.products.index');
    Route::get('/products/add', [ProductController::class, 'create'])->name('admin.products.create');
    Route::post('/products', [ProductController::class, 'store'])->name('admin.products.store');
    Route::get('/products/{id}', [ProductController::class, 'show'])->name('admin.products.show');
    Route::get('/products/{id}/edit', [ProductController::class, 'edit'])->name('admin.products.edit');
    Route::put('/products/{id}', [ProductController::class, 'update'])->name('admin.products.update');
    Route::delete('/products/{id}', [ProductController::class, 'destroy'])->name('admin.products.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
