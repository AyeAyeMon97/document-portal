<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\AuthService;
use App\Traits\ApiResponseTrait;

class UserController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private AuthService $authService
    ) {}

    public function index()
    {
        $users = User::query()
            ->with('role.permissions')
            ->latest()
            ->get();

        return UserResource::collection($users);
    }

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
