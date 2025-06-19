<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Kategori;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'ONT',
            'OLT',
            'Switch',
            'Hub',
            'Tool & Equipment'
        ];

        foreach ($categories as $category) {
            Kategori::create([
                'nama_kategori' => $category
            ]);
        }
    }
}
