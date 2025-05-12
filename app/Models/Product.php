<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama_produk',
        'brand_produk',
        'kategori_id',
        'deskripsi_produk',
        'gambar_produk',
        'harga_produk',
        'stock_produk',
    ];

    /**
     * Get the category that owns the product.
     */
    public function category()
    {
        return $this->belongsTo(Kategori::class, 'kategori_id');
    }
}
