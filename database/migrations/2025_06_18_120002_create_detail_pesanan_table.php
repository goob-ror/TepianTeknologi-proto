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
        Schema::create('detail_pesanan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pesanan_id')
                    ->constrained('pesanan')
                    ->onDelete('cascade');
            $table->foreignId('produk_id')
                    ->constrained('produk')
                    ->onDelete('restrict');
            $table->integer('jumlah')->unsigned();
            $table->decimal('harga_satuan', 12, 2)->unsigned();
            $table->decimal('subtotal', 12, 2)->storedAs('jumlah * harga_satuan');
            $table->timestamps();

            // Add indexes for performance
            $table->index('pesanan_id');
            $table->index('produk_id');

            // Add unique constraint to prevent duplicate items in same order
            $table->unique(['pesanan_id', 'produk_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_pesanan');
    }
};
