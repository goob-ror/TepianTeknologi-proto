<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Kategori;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //Buat Foreign Key
        $olt = Kategori::where('jenis_kategori', 'OLT')->first();
        $ont = Kategori::where('jenis_kategori', 'ONT')->first();

        Product::insert([
            [
                'nama_produk' => 'PRODUK-A1',
                'brand_produk' => 'CDATA',
                'deskripsi_produk' => 'mantap le',
                'gambar_produk' => 'https://cdata.id/admin/img/produk/1736325931_677e3b2bab154.png',
                'kategori_id' => $olt->id,
                'harga_produk' => 1600000.000,
                'stock_produk' => 100
            ],
            [
                'nama_produk' => 'PRODUK-B1',
                'brand_produk' => 'CDATA',
                'deskripsi_produk' => 'mantap le2',
                'gambar_produk' => 'https://cdata.id/admin/img/produk/1736329706_677e49ea70500.png',
                'kategori_id' => $olt->id,
                'harga_produk' => 2500000.000,
                'stock_produk' => 100
            ],
            [
                'nama_produk' => 'PRODUK-C1',
                'brand_produk' => 'CDATA',
                'deskripsi_produk' => 'mantap le3',
                'gambar_produk' => 'https://cdata.id/admin/img/produk/1736329671_677e49c71e0b9.png',
                'kategori_id' => $ont->id,
                'harga_produk' => 800000.000,
                'stock_produk' => 100
            ],
        ]);
    }
}
