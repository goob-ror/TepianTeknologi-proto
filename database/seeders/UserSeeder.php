<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\enum\UserRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        User::insert([
            [
                'name' => 'User123',
                'fullname' => 'user ganteng',
                'email' => 'user@usergmail.com',
                'password' => Hash::make('password123'),
                'role' => UserRole::user
            ],

            [
                'name' => 'Admin123',
                'fullname' => 'admin tampan',
                'email' => 'admin@admingmail.com',
                'password' => Hash::make('password123'),
                'role' => UserRole::admin
            ],
        ]);
    }
}
