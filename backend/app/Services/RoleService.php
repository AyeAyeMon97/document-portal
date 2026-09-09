<?php

namespace App\Services;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RoleService
{
    public function getAll()
    {
        return Role::query()
            ->with('permissions')
            ->withCount('users')
            ->orderBy('name')
            ->get();
    }

    public function find(string $id): Role
    {
        return Role::with('permissions')
            ->withCount('users')
            ->findOrFail($id);
    }

    public function create(array $data): Role
    {
        return DB::transaction(function () use ($data) {
            $role = Role::create([
                'name' => $data['name'],
                'slug' => $data['slug'] ?? Str::slug($data['name']),
                'description' => $data['description'] ?? null,
            ]);

            if (! empty($data['permission_ids'])) {
                $role->permissions()->sync($data['permission_ids']);
            }

            return $role->load('permissions')->loadCount('users');
        });
    }

    public function update(Role $role, array $data): Role
    {
        return DB::transaction(function () use ($role, $data) {
            $role->update([
                'name' => $data['name'] ?? $role->name,
                'slug' => $data['slug'] ?? $role->slug,
                'description' => array_key_exists('description', $data)
                    ? $data['description']
                    : $role->description,
            ]);

            if (array_key_exists('permission_ids', $data)) {
                $role->permissions()->sync($data['permission_ids'] ?? []);
            }

            return $role->load('permissions')->loadCount('users');
        });
    }

    public function syncPermissions(Role $role, array $permissionIds): Role
    {
        $role->permissions()->sync($permissionIds);

        return $role->load('permissions')->loadCount('users');
    }

    public function delete(Role $role): void
    {
        if ($role->users()->exists()) {
            abort(422, 'Cannot delete a role that is assigned to users.');
        }

        if (in_array($role->slug, ['admin', 'member'], true)) {
            abort(422, 'Cannot delete system roles.');
        }

        $role->permissions()->detach();
        $role->delete();
    }
}
