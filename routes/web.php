<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\admin\CategoryController;
use App\Http\Controllers\admin\UserController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

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
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::get('/categories/{id}/delete', [CategoryController::class, 'destroy']);
    Route::get('/categories/add', function () {
        return Inertia::render('admin/category/add');
    });

    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}/soft-delete', [UserController::class, 'softDelete']);
    Route::get('/users/add', function () {
        return Inertia::render('admin/user/add');
    });

    Route::get('/products/add', function () {
        return Inertia::render('admin/product/create');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
