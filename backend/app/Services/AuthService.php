<?php

namespace App\Services;

use App\Models\Role;
use App\Models\User;

class AuthService
{
    public function login(array $credentials): array
    {
        if (! $token = auth('api')->attempt($credentials)) {
            throw new \Exception('Invalid email or password.', 401);
        }

        $user = auth('api')->user();
        $user->load('role.permissions');

        return [
            'token' => $token,
            'user' => $user,
        ];
    }

    public function createUser(array $data): User
    {
        $roleId = $data['role_id'] ?? null;

        if (! $roleId && ! empty($data['role'])) {
            $roleId = Role::query()
                ->where('slug', $data['role'])
                ->value('id');
        }

        if (! $roleId) {
            $roleId = Role::query()
                ->where('slug', 'member')
                ->value('id');
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role_id' => $roleId,
        ]);

        return $user->load('role.permissions');
    }

    public function logout(): void
    {
        auth('api')->logout();
    }
}
