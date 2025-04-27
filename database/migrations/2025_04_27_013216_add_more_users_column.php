<?php

use Illuminate\Database\Migrations\Migration;
use App\enum\UserRole;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        //
        Schema::table('users', function(Blueprint $table) {
            $table->string('fullname');
            $table->boolean('isDeleted')->default(false);
            $table->string('role')->default(UserRole::user);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::dropIfExists('users');
    }
};
