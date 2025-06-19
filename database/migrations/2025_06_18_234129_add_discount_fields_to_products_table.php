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
        Schema::table('produk', function (Blueprint $table) {
            $table->boolean('is_diskon')->default(false)->after('is_active');
            $table->decimal('harga_diskon', 12, 2)->unsigned()->nullable()->after('is_diskon');
            $table->integer('diskon_persen')->unsigned()->nullable()->after('harga_diskon');

            // Add index for discount queries
            $table->index('is_diskon');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('produk', function (Blueprint $table) {
            $table->dropIndex(['is_diskon']);
            $table->dropColumn(['is_diskon', 'harga_diskon', 'diskon_persen']);
        });
    }
};
