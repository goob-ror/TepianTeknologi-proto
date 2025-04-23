<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Kategori;
use Illuminate\Database\Seeder;

class KategoriSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        Kategori::insert([
            ['jenis_kategori' => 'ONT'],
            ['jenis_kategori' => 'OLT'],
            ['jenis_kategori' => 'Router']
        ]);
    }
}
