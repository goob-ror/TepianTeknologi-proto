<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'produk';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama_produk',
        'deskripsi',
        'harga',
        'stok',
        'gambar',
        'kategori_id',
        'brand_id',
        'is_active',
        'is_diskon',
        'harga_diskon',
        'diskon_persen',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'harga' => 'decimal:2',
        'harga_diskon' => 'decimal:2',
        'is_active' => 'boolean',
        'is_diskon' => 'boolean',
    ];

    /**
     * Get the category that owns the product.
     */
    public function category()
    {
        return $this->belongsTo(Kategori::class, 'kategori_id');
    }

    /**
     * Get the brand that owns the product.
     */
    public function brand()
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }

    /**
     * Get the order details for the product.
     */
    public function orderDetails()
    {
        return $this->hasMany(DetailPesanan::class, 'produk_id');
    }

    /**
     * Scope a query to only include active products.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include products with stock.
     */
    public function scopeInStock($query)
    {
        return $query->where('stok', '>', 0);
    }

    /**
     * Scope a query to only include products with discount.
     */
    public function scopeOnDiscount($query)
    {
        return $query->where('is_diskon', true);
    }

    /**
     * Get the effective price (discounted price if on discount, otherwise regular price).
     */
    public function getEffectivePriceAttribute()
    {
        return $this->is_diskon && $this->harga_diskon ? $this->harga_diskon : $this->harga;
    }

    /**
     * Get the discount percentage.
     */
    public function getDiscountPercentageAttribute()
    {
        if (!$this->is_diskon || !$this->harga_diskon) {
            return 0;
        }

        if ($this->diskon_persen) {
            return $this->diskon_persen;
        }

        // Calculate percentage from prices
        return round((($this->harga - $this->harga_diskon) / $this->harga) * 100);
    }

    /**
     * Get the savings amount.
     */
    public function getSavingsAmountAttribute()
    {
        if (!$this->is_diskon || !$this->harga_diskon) {
            return 0;
        }

        return $this->harga - $this->harga_diskon;
    }
}
