<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pesanan>
 */
class PesananFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'nama_penerima' => $this->faker->name(),
            'alamat' => $this->faker->address(),
            'no_hp_penerima' => $this->faker->phoneNumber(),
            'catatan' => $this->faker->optional()->sentence(),
            'status' => $this->faker->randomElement(['menunggu', 'dibayar', 'dikirim', 'selesai', 'dibatalkan']),
            'total_harga' => $this->faker->numberBetween(100000, 10000000),
        ];
    }
}
