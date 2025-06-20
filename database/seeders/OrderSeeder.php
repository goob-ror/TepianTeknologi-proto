<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Pesanan;
use App\Models\DetailPesanan;
use App\Models\User;
use App\Models\Product;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some users and products for the orders
        $users = User::where('role', 'user')->take(5)->get();
        $products = Product::take(10)->get();

        if ($users->isEmpty() || $products->isEmpty()) {
            $this->command->info('No users or products found. Please seed users and products first.');
            return;
        }

        // Create sample orders for the last 6 months
        $statuses = ['menunggu', 'dibayar', 'dikirim', 'selesai'];
        $currentDate = Carbon::now();

        for ($monthOffset = 5; $monthOffset >= 0; $monthOffset--) {
            $targetDate = $currentDate->copy()->subMonths($monthOffset);

            // Create 5-15 orders per month
            $ordersCount = rand(5, 15);

            for ($i = 0; $i < $ordersCount; $i++) {
                $user = $users->random();
                $orderDate = $targetDate->copy()->addDays(rand(1, 28));

                // Create the order
                $order = Pesanan::create([
                    'user_id' => $user->id,
                    'nama_penerima' => $user->nama_lengkap,
                    'alamat' => 'Jl. Sample Address No. ' . rand(1, 100),
                    'no_hp_penerima' => '08' . rand(1000000000, 9999999999),
                    'catatan' => 'Sample order for testing',
                    'status' => $statuses[array_rand($statuses)],
                    'total_harga' => 0, // Will be calculated after adding details
                    'created_at' => $orderDate,
                    'updated_at' => $orderDate,
                ]);

                // Add 1-5 products to each order
                $productCount = rand(1, 5);
                $totalHarga = 0;
                $selectedProducts = $products->random($productCount);

                foreach ($selectedProducts as $product) {
                    $quantity = rand(1, 3);
                    $price = $product->is_diskon && $product->harga_diskon
                        ? $product->harga_diskon
                        : $product->harga;

                    $subtotal = $quantity * $price;
                    $totalHarga += $subtotal;

                    DetailPesanan::create([
                        'pesanan_id' => $order->id,
                        'produk_id' => $product->id,
                        'jumlah' => $quantity,
                        'harga_satuan' => $price,
                    ]);
                }

                // Update the total price
                $order->update(['total_harga' => $totalHarga]);
            }
        }

        $this->command->info('Sample orders created successfully!');
    }
}
