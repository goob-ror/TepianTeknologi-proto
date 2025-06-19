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
        Schema::create('pesanan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                    ->constrained('users')
                    ->onDelete('restrict');
            $table->string('nama_penerima', 100);
            $table->text('alamat');
            $table->string('no_hp_penerima', 20)->nullable();
            $table->text('catatan')->nullable();
            $table->enum('status', ['menunggu', 'dibayar', 'dikirim', 'selesai', 'dibatalkan'])
                    ->default('menunggu');
            $table->decimal('total_harga', 12, 2)->unsigned();
            $table->timestamps();

            // Add indexes for performance
            $table->index('user_id');
            $table->index('status');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pesanan');
    }
};
