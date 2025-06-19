<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // Core data seeders (must run first)
            AdminUserSeeder::class,
            CategorySeeder::class,
            BrandSeeder::class,
            ProductSeeder::class,

            // Transaction data seeders (depend on core data)
            PesananSeeder::class,
            DetailPesananSeeder::class,
        ]);
    }
}
