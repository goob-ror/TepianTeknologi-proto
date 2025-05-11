<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'user'])->group(function () {
    Route::redirect('settings', 'settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');
});

Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::redirect('settings', 'settings/profile');

    Route::get('admin/settings/profile', [ProfileController::class, 'edit'])->name('admin.profile.edit');
    Route::patch('admin/settings/profile', [ProfileController::class, 'update'])->name('admin.profile.update');
    Route::delete('admin/settings/profile', [ProfileController::class, 'destroy'])->name('admin.profile.destroy');

    Route::get('admin/settings/password', [PasswordController::class, 'edit'])->name('admin.password.edit');
    Route::put('admin/settings/password', [PasswordController::class, 'update'])->name('admin.password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');
});
