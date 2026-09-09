<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePermissionRequest;
use App\Http\Resources\PermissionResource;
use App\Services\PermissionService;
use App\Traits\ApiResponseTrait;

class PermissionController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private PermissionService $permissionService
    ) {}

    public function index()
    {
        return PermissionResource::collection(
            $this->permissionService->getAll()
        );
    }

    public function show(string $permission)
    {
        return $this->success(
            new PermissionResource(
                $this->permissionService->find($permission)
            )
        );
    }

    public function store(StorePermissionRequest $request)
    {
        $permission = $this->permissionService->create(
            $request->validated()
        );

        return $this->success(
            new PermissionResource($permission),
            'Permission created successfully',
            201
        );
    }
}
