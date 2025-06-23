<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_produk' => $this->faker->words(3, true),
            'deskripsi' => $this->faker->paragraph(),
            'harga' => $this->faker->numberBetween(50000, 5000000),
            'stok' => $this->faker->numberBetween(0, 100),
            'gambar' => null,
            'kategori_id' => \App\Models\Kategori::factory(),
            'brand_id' => \App\Models\Brand::factory(),
            'is_active' => 1,
            'is_diskon' => 0,
            'harga_diskon' => null,
            'diskon_persen' => null,
        ];
    }
}
