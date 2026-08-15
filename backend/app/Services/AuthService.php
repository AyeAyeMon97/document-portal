<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthService
{
    public function login(array $credentials): array
    {
        if (! $token = auth('api')->attempt($credentials)) {
            throw new \Exception('Invalid email or password.', 401);
        }
        return [
            'token' => $token,
            'user' => auth('api')->user(),
        ];
    }

    public function createUser(array $data): User
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'] ?? 'member',
        ]);
    }

    public function logout(): void
    {
        auth('api')->logout();
    }
}
