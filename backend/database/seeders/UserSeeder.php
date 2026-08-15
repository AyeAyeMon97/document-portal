<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@workspace.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Member One',
            'email' => 'member1@workspace.com',
            'password' => Hash::make('password'),
            'role' => 'member',
        ]);

        User::create([
            'name' => 'Member Two',
            'email' => 'member2@workspace.com',
            'password' => Hash::make('password'),
            'role' => 'member',
        ]);
    }
}
