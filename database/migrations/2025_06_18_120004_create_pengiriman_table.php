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
        Schema::create('pengiriman', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pesanan_id')
                    ->constrained('pesanan')
                    ->onDelete('cascade');
            $table->string('nomor_resi', 100)->nullable();
            $table->string('jasa_kirim', 100);
            $table->enum('status_kirim', ['belum_dikirim', 'dikirim', 'dalam_perjalanan', 'sampai'])
                    ->default('belum_dikirim');
            $table->timestamp('tanggal_kirim')->nullable();
            $table->timestamp('tanggal_sampai')->nullable();
            $table->decimal('biaya_kirim', 10, 2)->default(0);
            $table->timestamps();
            
            // Add indexes for performance
            $table->index('pesanan_id');
            $table->index('status_kirim');
            $table->index('nomor_resi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengiriman');
    }
};
