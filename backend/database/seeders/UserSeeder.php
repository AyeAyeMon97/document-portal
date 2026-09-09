<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRoleId = Role::where('slug', 'admin')->value('id');
        $memberRoleId = Role::where('slug', 'member')->value('id');

        User::create([
            'name' => 'Admin',
            'email' => 'admin@workspace.com',
            'password' => 'password',
            'role_id' => $adminRoleId,
        ]);

        User::create([
            'name' => 'Member One',
            'email' => 'member1@workspace.com',
            'password' => 'password',
            'role_id' => $memberRoleId,
        ]);

        User::create([
            'name' => 'Member Two',
            'email' => 'member2@workspace.com',
            'password' => 'password',
            'role_id' => $memberRoleId,
        ]);
    }
}
