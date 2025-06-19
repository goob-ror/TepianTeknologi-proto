<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Kategori;
use App\Models\Brand;
use App\Models\Product;

class AdditionalProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get categories and brands
        $ont = Kategori::where('nama_kategori', 'ONT')->first();
        $olt = Kategori::where('nama_kategori', 'OLT')->first();
        $switch = Kategori::where('nama_kategori', 'Switch')->first();
        $hub = Kategori::where('nama_kategori', 'Hub')->first();
        $tool = Kategori::where('nama_kategori', 'Tool & Equipment')->first();

        $cdata = Brand::where('nama_brand', 'CDATA')->first();
        $starlink = Brand::where('nama_brand', 'Starlink')->first();
        $mikrotik = Brand::where('nama_brand', 'Mikrotik')->first();
        $cisco = Brand::where('nama_brand', 'Cisco')->first();
        $ruijie = Brand::where('nama_brand', 'Ruijie')->first();
        $tplink = Brand::where('nama_brand', 'TP-Link')->first();

        $additionalProducts = [
            [
                'nama_produk' => 'ONT CDATA FD1002S',
                'deskripsi' => 'ONT CDATA FD1002S dengan 2 port Gigabit Ethernet untuk layanan FTTH residensial.',
                'harga' => 320000.00,
                'harga_diskon' => 280000.00,
                'is_diskon' => true,
                'stok' => 35,
                'kategori_id' => $ont->id,
                'brand_id' => $cdata->id,
                'is_active' => true,
                'created_at' => now()->subDays(1),
                'updated_at' => now()->subDays(1),
            ],
            [
                'nama_produk' => 'Switch Cisco SG350-28',
                'deskripsi' => 'Switch managed 28 port dengan 24 Gigabit Ethernet dan 4 SFP ports.',
                'harga' => 9500000.00,
                'stok' => 10,
                'kategori_id' => $switch->id,
                'brand_id' => $cisco->id,
                'is_active' => true,
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(3),
            ],
            [
                'nama_produk' => 'Router Mikrotik CCR1009',
                'deskripsi' => 'Cloud Core Router dengan 8 core CPU dan throughput hingga 12 Mpps.',
                'harga' => 5500000.00,
                'harga_diskon' => 4800000.00,
                'is_diskon' => true,
                'stok' => 8,
                'kategori_id' => $switch->id,
                'brand_id' => $mikrotik->id,
                'is_active' => true,
                'created_at' => now()->subDays(4),
                'updated_at' => now()->subDays(4),
            ],
            [
                'nama_produk' => 'OLT Ruijie RG-OLT8000',
                'deskripsi' => 'OLT dengan 8 port GPON dan kapasitas hingga 512 ONT per port.',
                'harga' => 18000000.00,
                'stok' => 5,
                'kategori_id' => $olt->id,
                'brand_id' => $ruijie->id,
                'is_active' => true,
                'created_at' => now()->subDays(6),
                'updated_at' => now()->subDays(6),
            ],
            [
                'nama_produk' => 'Switch TP-Link TL-SG3428',
                'deskripsi' => 'Switch managed Layer 2+ dengan 24 Gigabit ports dan 4 SFP slots.',
                'harga' => 4200000.00,
                'stok' => 15,
                'kategori_id' => $switch->id,
                'brand_id' => $tplink->id,
                'is_active' => true,
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subDays(7),
            ],
            [
                'nama_produk' => 'Fiber Optic Tester',
                'deskripsi' => 'Alat untuk testing fiber optic dengan power meter dan visual fault locator.',
                'harga' => 2800000.00,
                'harga_diskon' => 2400000.00,
                'is_diskon' => true,
                'stok' => 12,
                'kategori_id' => $tool->id,
                'brand_id' => $tplink->id,
                'is_active' => true,
                'created_at' => now()->subDays(9),
                'updated_at' => now()->subDays(9),
            ],
            [
                'nama_produk' => 'Hub Starlink SH-8P',
                'deskripsi' => 'Hub 8 port Fast Ethernet dengan LED indicator dan compact design.',
                'harga' => 180000.00,
                'stok' => 45,
                'kategori_id' => $hub->id,
                'brand_id' => $starlink->id,
                'is_active' => true,
                'created_at' => now()->subDays(11),
                'updated_at' => now()->subDays(11),
            ],
            [
                'nama_produk' => 'Network Cable Cat6',
                'deskripsi' => 'Kabel UTP Cat6 305 meter dengan kualitas premium untuk instalasi jaringan.',
                'harga' => 850000.00,
                'stok' => 25,
                'kategori_id' => $tool->id,
                'brand_id' => $tplink->id,
                'is_active' => true,
                'created_at' => now()->subDays(13),
                'updated_at' => now()->subDays(13),
            ],
            [
                'nama_produk' => 'ONT Starlink SL2000',
                'deskripsi' => 'ONT dual band dengan WiFi AC1200 dan 4 port Gigabit Ethernet.',
                'harga' => 650000.00,
                'stok' => 28,
                'kategori_id' => $ont->id,
                'brand_id' => $starlink->id,
                'is_active' => true,
                'created_at' => now()->subDays(14),
                'updated_at' => now()->subDays(14),
            ],
            [
                'nama_produk' => 'Switch Ruijie RG-S5750-24GT',
                'deskripsi' => 'Switch Layer 3 dengan 24 Gigabit ports dan advanced routing features.',
                'harga' => 7800000.00,
                'harga_diskon' => 7200000.00,
                'is_diskon' => true,
                'stok' => 9,
                'kategori_id' => $switch->id,
                'brand_id' => $ruijie->id,
                'is_active' => true,
                'created_at' => now()->subDays(16),
                'updated_at' => now()->subDays(16),
            ],
        ];

        foreach ($additionalProducts as $product) {
            Product::create($product);
        }
    }
}
