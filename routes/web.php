<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\admin\CategoryController;
use App\Http\Controllers\admin\BrandController;
use App\Http\Controllers\admin\ProductController as AdminProductController;
use App\Http\Controllers\admin\UserController;
use App\Http\Controllers\admin\OrderController;
use App\Http\Controllers\HomeController;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/katalog', [HomeController::class, 'katalog'])->name('katalog');

Route::get('/detail-produk/{id}', [HomeController::class, 'detailProduk'])->name('detail-produk');

// API route for product search
Route::get('/api/products/search', [HomeController::class, 'searchProducts'])->name('api.products.search');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/history', [HomeController::class, 'history'])->name('history');
    Route::get('/checkout', [HomeController::class, 'checkout'])->name('checkout');

    // Cart management routes
    Route::post('/cart/add', [HomeController::class, 'addToCart'])->name('cart.add');
    Route::patch('/cart/update', [HomeController::class, 'updateCart'])->name('cart.update');
    Route::delete('/cart/remove', [HomeController::class, 'removeFromCart'])->name('cart.remove');
    Route::delete('/cart/clear', [HomeController::class, 'clearCart'])->name('cart.clear');
    Route::post('/cart/sync', [HomeController::class, 'syncCart'])->name('cart.sync');

    // Order processing routes
    Route::post('/order/create', [HomeController::class, 'createOrder'])->name('order.create');
});

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
    Route::get('admin/dashboard', [AdminProductController::class, 'dashboard'])->name('admin.dashboard');

    // Categories routes
    Route::resource('admin/categories', CategoryController::class, [
        'names' => [
            'index' => 'admin.categories.index',
            'create' => 'admin.categories.create',
            'store' => 'admin.categories.store',
            'show' => 'admin.categories.show',
            'edit' => 'admin.categories.edit',
            'update' => 'admin.categories.update',
            'destroy' => 'admin.categories.destroy',
        ]
    ]);

    // Brands routes
    Route::resource('admin/brands', BrandController::class, [
        'names' => [
            'index' => 'admin.brands.index',
            'create' => 'admin.brands.create',
            'store' => 'admin.brands.store',
            'show' => 'admin.brands.show',
            'edit' => 'admin.brands.edit',
            'update' => 'admin.brands.update',
            'destroy' => 'admin.brands.destroy',
        ]
    ]);

    // Products routes
    Route::resource('admin/products', AdminProductController::class, [
        'names' => [
            'index' => 'admin.products.index',
            'create' => 'admin.products.create',
            'store' => 'admin.products.store',
            'show' => 'admin.products.show',
            'edit' => 'admin.products.edit',
            'update' => 'admin.products.update',
            'destroy' => 'admin.products.destroy',
        ]
    ]);

    // Additional product routes
    Route::patch('admin/products/{product}/toggle-status', [AdminProductController::class, 'toggleStatus'])
        ->name('admin.products.toggle-status');

    // Order Management routes (note: specific routes must come before resource routes)
    Route::get('admin/orders/pending', [OrderController::class, 'pending'])->name('admin.orders.pending');
    Route::get('admin/orders/pending-count', [OrderController::class, 'getPendingCount'])->name('admin.orders.pending-count');
    Route::get('admin/orders/export', [OrderController::class, 'export'])->name('admin.orders.export');
    Route::get('admin/orders/statistics', [OrderController::class, 'statistics'])->name('admin.orders.statistics');
    Route::patch('admin/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('admin.orders.update-status');
    Route::post('admin/orders/bulk-update', [OrderController::class, 'bulkUpdateStatus'])->name('admin.orders.bulk-update');

    // Order resource routes
    Route::resource('admin/orders', OrderController::class, [
        'names' => [
            'index' => 'admin.orders.index',
            'show' => 'admin.orders.show',
        ],
        'only' => ['index', 'show']
    ]);

    // User Management routes
    Route::get('admin/users', [UserController::class, 'index'])->name('admin.users.index');
    Route::get('admin/users/create', [UserController::class, 'create'])->name('admin.users.create');
    Route::post('admin/users', [UserController::class, 'store'])->name('admin.users.store');
    Route::get('admin/users/{user}', [UserController::class, 'show'])->name('admin.users.show');
    Route::get('admin/users/{user}/edit', [UserController::class, 'edit'])->name('admin.users.edit');
    Route::put('admin/users/{user}', [UserController::class, 'update'])->name('admin.users.update');
    Route::delete('admin/users/{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');

    // Admin Management routes (separate from users)
    Route::get('admin/admins', [UserController::class, 'admins'])->name('admin.admins.index');
    Route::get('admin/admins/create', [UserController::class, 'create'])->name('admin.admins.create');
    Route::post('admin/admins', [UserController::class, 'store'])->name('admin.admins.store');
    Route::get('admin/admins/{user}', [UserController::class, 'show'])->name('admin.admins.show');
    Route::get('admin/admins/{user}/edit', [UserController::class, 'edit'])->name('admin.admins.edit');
    Route::put('admin/admins/{user}', [UserController::class, 'update'])->name('admin.admins.update');
    Route::delete('admin/admins/{user}', [UserController::class, 'destroy'])->name('admin.admins.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
