<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Kategori;
use App\Models\Brand;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get categories and brands that exist in our seeders
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

        // Check if required categories and brands exist
        if (!$ont || !$olt || !$switch || !$hub || !$tool) {
            throw new \Exception('Some categories are missing. Please run CategorySeeder first.');
        }

        if (!$cdata || !$starlink || !$mikrotik || !$cisco || !$ruijie || !$tplink) {
            throw new \Exception('Some brands are missing. Please run BrandSeeder first.');
        }

        $products = [
            [
                'nama_produk' => 'ONT CDATA FD1104S',
                'deskripsi' => 'ONT CDATA FD1104S adalah perangkat ONT dengan 4 port Gigabit Ethernet dan 2 port POTS untuk layanan triple play.',
                'harga' => 450000.00,
                'stok' => 25,
                'kategori_id' => $ont->id,
                'brand_id' => $cdata->id,
                'is_active' => true,
                'created_at' => now()->subDays(45),
                'updated_at' => now()->subDays(45),
            ],
            [
                'nama_produk' => 'OLT CDATA FD1616GS',
                'deskripsi' => 'OLT CDATA FD1616GS adalah perangkat OLT dengan 16 port GPON dan kapasitas hingga 1024 ONT.',
                'harga' => 15000000.00,
                'stok' => 8,
                'kategori_id' => $olt->id,
                'brand_id' => $cdata->id,
                'is_active' => true,
                'created_at' => now()->subDays(38),
                'updated_at' => now()->subDays(38),
            ],
            [
                'nama_produk' => 'Switch Cisco Catalyst 2960',
                'deskripsi' => 'Switch managed 24 port Gigabit Ethernet dengan fitur Layer 2 dan keamanan tingkat enterprise.',
                'harga' => 8500000.00,
                'stok' => 15,
                'kategori_id' => $switch->id,
                'brand_id' => $cisco->id,
                'is_active' => true,
                'created_at' => now()->subDays(32),
                'updated_at' => now()->subDays(32),
            ],
            [
                'nama_produk' => 'Router Mikrotik hEX S',
                'deskripsi' => 'Router Mikrotik hEX S dengan 5 port Gigabit Ethernet, SFP port, dan dual core CPU 880MHz.',
                'harga' => 1200000.00,
                'stok' => 30,
                'kategori_id' => $switch->id,
                'brand_id' => $mikrotik->id,
                'is_active' => true,
                'created_at' => now()->subDays(28),
                'updated_at' => now()->subDays(28),
            ],
            [
                'nama_produk' => 'Switch TP-Link TL-SG1024D',
                'deskripsi' => 'Switch unmanaged 24 port Gigabit Ethernet dengan desain desktop/rackmount dan hemat energi.',
                'harga' => 2500000.00,
                'stok' => 20,
                'kategori_id' => $switch->id,
                'brand_id' => $tplink->id,
                'is_active' => true,
                'created_at' => now()->subDays(25),
                'updated_at' => now()->subDays(25),
            ],
            [
                'nama_produk' => 'ONT Starlink SL1000',
                'deskripsi' => 'ONT Starlink SL1000 dengan 4 port Fast Ethernet dan 1 port POTS untuk layanan FTTH.',
                'harga' => 350000.00,
                'stok' => 40,
                'kategori_id' => $ont->id,
                'brand_id' => $starlink->id,
                'is_active' => true,
                'created_at' => now()->subDays(22),
                'updated_at' => now()->subDays(22),
            ],
            [
                'nama_produk' => 'Hub TP-Link TL-SF1005D',
                'deskripsi' => 'Hub 5 port Fast Ethernet dengan auto-negotiation dan plug-and-play installation.',
                'harga' => 150000.00,
                'stok' => 50,
                'kategori_id' => $hub->id,
                'brand_id' => $tplink->id,
                'is_active' => true,
                'created_at' => now()->subDays(18),
                'updated_at' => now()->subDays(18),
            ],
            [
                'nama_produk' => 'Crimping Tool RJ45',
                'deskripsi' => 'Tool untuk crimping konektor RJ45 dengan kualitas profesional dan grip yang nyaman.',
                'harga' => 85000.00,
                'stok' => 5,
                'kategori_id' => $tool->id,
                'brand_id' => $tplink->id,
                'is_active' => true,
                'created_at' => now()->subDays(15),
                'updated_at' => now()->subDays(15),
            ],
            [
                'nama_produk' => 'Switch Ruijie RG-S2910-24GT4XS',
                'deskripsi' => 'Switch managed Layer 3 dengan 24 port Gigabit dan 4 port 10G SFP+ untuk backbone network.',
                'harga' => 12000000.00,
                'stok' => 12,
                'kategori_id' => $switch->id,
                'brand_id' => $ruijie->id,
                'is_active' => true,
                'created_at' => now()->subDays(12),
                'updated_at' => now()->subDays(12),
            ],
            [
                'nama_produk' => 'Cable Tester RJ45',
                'deskripsi' => 'Alat untuk testing kabel UTP/STP dengan LED indicator dan tone generator.',
                'harga' => 125000.00,
                'stok' => 25,
                'kategori_id' => $tool->id,
                'brand_id' => $tplink->id,
                'is_active' => true,
                'created_at' => now()->subDays(8),
                'updated_at' => now()->subDays(8),
            ],
            [
                'nama_produk' => 'Router Mikrotik RB4011',
                'deskripsi' => 'Router enterprise dengan 10 port Gigabit, SFP+ port, dan ARM quad core 1.4GHz processor.',
                'harga' => 3500000.00,
                'stok' => 18,
                'kategori_id' => $switch->id,
                'brand_id' => $mikrotik->id,
                'is_active' => true,
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
            ],
            [
                'nama_produk' => 'Patch Panel 24 Port',
                'deskripsi' => 'Patch panel 24 port Cat6 dengan kualitas premium untuk instalasi structured cabling.',
                'harga' => 450000.00,
                'stok' => 30,
                'kategori_id' => $tool->id,
                'brand_id' => $tplink->id,
                'is_active' => true,
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
