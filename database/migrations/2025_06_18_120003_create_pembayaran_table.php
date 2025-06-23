<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pembayaran', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pesanan_id')
                    ->constrained('pesanan')
                    ->onDelete('cascade');
            $table->string('metode', 100);
            $table->string('bukti_pembayaran', 255)->nullable();
            $table->enum('status', ['menunggu_validasi', 'valid', 'tidak_valid'])
                    ->default('menunggu_validasi');
            $table->decimal('jumlah_bayar', 12, 2)->unsigned();
            $table->timestamp('tanggal_bayar')->useCurrent();
            $table->timestamp('validated_at')->nullable();
            $table->foreignId('validated_by')
                    ->nullable()
                    ->constrained('users')
                    ->onDelete('set null');
            $table->text('catatan_validasi')->nullable();
            $table->timestamps();

            // Add indexes for performance
            $table->index('pesanan_id');
            $table->index('status');
            $table->index('tanggal_bayar');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayaran');
    }
};
