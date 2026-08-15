<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreUserRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Traits\ApiResponseTrait;

class UserController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private AuthService $authService
    ) {}

    public function store(StoreUserRequest $request)
    {
        $user = $this->authService->createUser(
            $request->validated()
        );

        return $this->success(
            new UserResource($user),
            'User created successfully',
            201
        );
    }
}
