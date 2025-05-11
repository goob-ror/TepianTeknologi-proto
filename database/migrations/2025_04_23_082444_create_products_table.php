<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /** 2025_04_23_042814_create_products_table.php
     * Run the migrations. 2025_04_23_082444_create_kategoris_table.php
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('nama_produk');
            $table->string('brand_produk');
            $table->foreignId('kategori_id')
                    ->references('id')
                    ->on('kategoris')
                    ->onDelete('cascade');
            $table->text('deskripsi_produk')->nullable();
            $table->string('gambar_produk');
            $table->decimal('harga_produk', 12, 3);
            $table->unsignedInteger('stock_produk')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
