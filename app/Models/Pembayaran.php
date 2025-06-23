<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pembayaran extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'pembayaran';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'pesanan_id',
        'metode',
        'bukti_pembayaran',
        'status',
        'jumlah_bayar',
        'tanggal_bayar',
        'validated_at',
        'validated_by',
        'catatan_validasi',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'jumlah_bayar' => 'decimal:2',
        'tanggal_bayar' => 'datetime',
        'validated_at' => 'datetime',
    ];

    /**
     * Get the order that owns the payment.
     */
    public function pesanan()
    {
        return $this->belongsTo(Pesanan::class, 'pesanan_id');
    }

    /**
     * Get the user who validated the payment.
     */
    public function validator()
    {
        return $this->belongsTo(User::class, 'validated_by');
    }

    /**
     * Scope a query to only include pending validations.
     */
    public function scopePendingValidation($query)
    {
        return $query->where('status', 'menunggu_validasi');
    }
}
