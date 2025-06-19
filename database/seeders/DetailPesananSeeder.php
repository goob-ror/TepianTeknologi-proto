<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Pesanan;
use App\Models\Product;
use App\Models\DetailPesanan;

class DetailPesananSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get orders and products
        $orders = Pesanan::all();
        $products = Product::all();

        if ($orders->isEmpty() || $products->isEmpty()) {
            throw new \Exception('Orders or Products not found. Please run PesananSeeder and ProductSeeder first.');
        }

        // Create order details for each order
        $orderDetails = [
            // Order 1 - Total: 1,650,000
            [
                'pesanan_id' => 1,
                'produk_id' => $products->where('nama_produk', 'ONT CDATA FD1104S')->first() ? $products->where('nama_produk', 'ONT CDATA FD1104S')->first()->id : $products->first()->id,
                'jumlah' => 2,
                'harga_satuan' => 450000.00,
            ],
            [
                'pesanan_id' => 1,
                'produk_id' => $products->where('nama_produk', 'Patch Panel 24 Port')->first() ? $products->where('nama_produk', 'Patch Panel 24 Port')->first()->id : $products->skip(1)->first()->id,
                'jumlah' => 3,
                'harga_satuan' => 250000.00,
            ],

            // Order 2 - Total: 8,500,000
            [
                'pesanan_id' => 2,
                'produk_id' => $products->where('nama_produk', 'Switch Cisco Catalyst 2960')->first() ? $products->where('nama_produk', 'Switch Cisco Catalyst 2960')->first()->id : $products->skip(2)->first()->id,
                'jumlah' => 1,
                'harga_satuan' => 8500000.00,
            ],

            // Order 3 - Total: 3,500,000
            [
                'pesanan_id' => 3,
                'produk_id' => $products->where('nama_produk', 'Router Mikrotik RB4011')->first() ? $products->where('nama_produk', 'Router Mikrotik RB4011')->first()->id : $products->skip(3)->first()->id,
                'jumlah' => 1,
                'harga_satuan' => 3500000.00,
            ],

            // Order 4 - Total: 1,200,000
            [
                'pesanan_id' => 4,
                'produk_id' => $products->where('nama_produk', 'Router Mikrotik hEX S')->first() ? $products->where('nama_produk', 'Router Mikrotik hEX S')->first()->id : $products->skip(4)->first()->id,
                'jumlah' => 1,
                'harga_satuan' => 1200000.00,
            ],

            // Order 5 - Total: 450,000
            [
                'pesanan_id' => 5,
                'produk_id' => $products->where('nama_produk', 'Patch Panel 24 Port')->first() ? $products->where('nama_produk', 'Patch Panel 24 Port')->first()->id : $products->skip(5)->first()->id,
                'jumlah' => 1,
                'harga_satuan' => 450000.00,
            ],
        ];

        foreach ($orderDetails as $detail) {
            // Check if the product exists
            if ($detail['produk_id']) {
                DetailPesanan::create($detail);
            }
        }
    }
}
