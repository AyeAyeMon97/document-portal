<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\SyncRolePermissionsRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use App\Services\RoleService;
use App\Traits\ApiResponseTrait;

class RoleController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private RoleService $roleService
    ) {}

    public function index()
    {
        return RoleResource::collection(
            $this->roleService->getAll()
        );
    }

    public function show(string $role)
    {
        return $this->success(
            new RoleResource($this->roleService->find($role))
        );
    }

    public function store(StoreRoleRequest $request)
    {
        $role = $this->roleService->create($request->validated());

        return $this->success(
            new RoleResource($role),
            'Role created successfully',
            201
        );
    }

    public function update(UpdateRoleRequest $request, string $role)
    {
        $roleModel = Role::findOrFail($role);
        $roleModel = $this->roleService->update(
            $roleModel,
            $request->validated()
        );

        return $this->success(
            new RoleResource($roleModel),
            'Role updated successfully'
        );
    }

    public function destroy(string $role)
    {
        $roleModel = Role::findOrFail($role);
        $this->roleService->delete($roleModel);

        return $this->success(null, 'Role deleted successfully');
    }

    public function syncPermissions(
        SyncRolePermissionsRequest $request,
        string $role
    ) {
        $roleModel = Role::findOrFail($role);
        $roleModel = $this->roleService->syncPermissions(
            $roleModel,
            $request->validated()['permission_ids']
        );

        return $this->success(
            new RoleResource($roleModel),
            'Role permissions updated successfully'
        );
    }
}
