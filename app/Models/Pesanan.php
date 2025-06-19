<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pesanan extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'pesanan';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'nama_penerima',
        'alamat',
        'no_hp_penerima',
        'catatan',
        'status',
        'total_harga',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'total_harga' => 'decimal:2',
    ];

    /**
     * Get the user that owns the order.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the order details for the order.
     */
    public function details()
    {
        return $this->hasMany(DetailPesanan::class, 'pesanan_id');
    }

    /**
     * Get the payment for the order.
     */
    public function payment()
    {
        return $this->hasOne(Pembayaran::class, 'pesanan_id');
    }

    /**
     * Get the shipping for the order.
     */
    public function shipping()
    {
        return $this->hasOne(Pengiriman::class, 'pesanan_id');
    }

    /**
     * Scope a query to only include pending orders.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'menunggu');
    }

    /**
     * Scope a query to only include paid orders.
     */
    public function scopePaid($query)
    {
        return $query->where('status', 'dibayar');
    }
}
