<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pengiriman extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'pengiriman';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'pesanan_id',
        'nomor_resi',
        'jasa_kirim',
        'status_kirim',
        'tanggal_kirim',
        'tanggal_sampai',
        'biaya_kirim',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'biaya_kirim' => 'decimal:2',
        'tanggal_kirim' => 'datetime',
        'tanggal_sampai' => 'datetime',
    ];

    /**
     * Get the order that owns the shipping.
     */
    public function pesanan()
    {
        return $this->belongsTo(Pesanan::class, 'pesanan_id');
    }

    /**
     * Scope a query to only include shipped orders.
     */
    public function scopeShipped($query)
    {
        return $query->where('status_kirim', 'dikirim');
    }
}
