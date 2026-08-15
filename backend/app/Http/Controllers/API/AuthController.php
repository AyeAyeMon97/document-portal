<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Traits\ApiResponseTrait;

class AuthController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private AuthService $authService
    ) {}

    public function login(LoginRequest $request)
    {
        try {
            $result = $this->authService->login(
                $request->validated()
            );
            return $this->success([
                'token' => $result['token'],
                'user' => new UserResource($result['user']),
            ], 'Login successful');
        } catch (\Exception $e) {
            return $this->error(
                $e->getMessage(),
                $e->getCode() >= 400 ? $e->getCode() : 500
            );
        }
    }

    public function me()
    {
        return $this->success(
            new UserResource(auth('api')->user())
        );
    }

    public function logout()
    {
        $this->authService->logout();

        return $this->success(
            null,
            'Logout successful'
        );
    }
}
