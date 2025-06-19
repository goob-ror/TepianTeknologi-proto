<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Pesanan;

class PesananSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get users to create orders for
        $adminUser = User::where('email', 'admin@citranet.com')->first();
        $regularUser = User::where('email', 'user@citranet.com')->first();

        if (!$adminUser || !$regularUser) {
            throw new \Exception('Users not found. Please run AdminUserSeeder first.');
        }

        $orders = [
            [
                'user_id' => $regularUser->id,
                'nama_penerima' => 'John Doe',
                'alamat' => 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220',
                'no_hp_penerima' => '081234567890',
                'catatan' => 'Mohon dikirim pada jam kerja',
                'status' => 'selesai',
                'total_harga' => 1650000.00,
                'created_at' => now()->subDays(30),
                'updated_at' => now()->subDays(25),
            ],
            [
                'user_id' => $regularUser->id,
                'nama_penerima' => 'Jane Smith',
                'alamat' => 'Jl. Thamrin No. 456, Jakarta Pusat, DKI Jakarta 10230',
                'no_hp_penerima' => '081234567891',
                'catatan' => 'Harap hubungi sebelum pengiriman',
                'status' => 'dikirim',
                'total_harga' => 8500000.00,
                'created_at' => now()->subDays(15),
                'updated_at' => now()->subDays(10),
            ],
            [
                'user_id' => $adminUser->id,
                'nama_penerima' => 'Admin Test',
                'alamat' => 'Jl. Gatot Subroto No. 789, Jakarta Selatan, DKI Jakarta 12930',
                'no_hp_penerima' => '081234567892',
                'catatan' => 'Pengiriman untuk testing sistem',
                'status' => 'dibayar',
                'total_harga' => 3500000.00,
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subDays(5),
            ],
            [
                'user_id' => $regularUser->id,
                'nama_penerima' => 'Bob Wilson',
                'alamat' => 'Jl. Kuningan No. 321, Jakarta Selatan, DKI Jakarta 12940',
                'no_hp_penerima' => '081234567893',
                'catatan' => null,
                'status' => 'menunggu',
                'total_harga' => 1200000.00,
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(3),
            ],
            [
                'user_id' => $regularUser->id,
                'nama_penerima' => 'Alice Brown',
                'alamat' => 'Jl. Senayan No. 654, Jakarta Pusat, DKI Jakarta 10270',
                'no_hp_penerima' => '081234567894',
                'catatan' => 'Mohon dikemas dengan bubble wrap',
                'status' => 'dibatalkan',
                'total_harga' => 450000.00,
                'created_at' => now()->subDays(20),
                'updated_at' => now()->subDays(18),
            ],
        ];

        foreach ($orders as $order) {
            Pesanan::create($order);
        }
    }
}
