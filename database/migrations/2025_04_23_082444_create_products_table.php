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
        Schema::create('produk', function (Blueprint $table) {
            $table->id();
            $table->string('nama_produk', 150);
            $table->text('deskripsi')->nullable();
            $table->decimal('harga', 12, 2)->unsigned();
            $table->integer('stok')->unsigned()->default(0);
            $table->string('gambar', 255)->nullable();
            $table->foreignId('kategori_id')
                    ->constrained('kategori_produk')
                    ->onDelete('restrict');
            $table->foreignId('brand_id')
                    ->constrained('brand_produk')
                    ->onDelete('restrict');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Add indexes for performance
            $table->index('kategori_id');
            $table->index('brand_id');
            $table->index('harga');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produk');
    }
};
