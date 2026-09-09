<?php

namespace App\Services;

use App\Models\Permission;
use Illuminate\Support\Str;

class PermissionService
{
    public function getAll()
    {
        return Permission::query()
            ->orderBy('name')
            ->get();
    }

    public function find(string $id): Permission
    {
        return Permission::findOrFail($id);
    }

    public function create(array $data): Permission
    {
        return Permission::create([
            'name' => $data['name'],
            'slug' => $data['slug'] ?? Str::slug($data['name'], '.'),
            'description' => $data['description'] ?? null,
        ]);
    }

    public function update(Permission $permission, array $data): Permission
    {
        $permission->update([
            'name' => $data['name'] ?? $permission->name,
            'slug' => $data['slug'] ?? $permission->slug,
            'description' => array_key_exists('description', $data)
                ? $data['description']
                : $permission->description,
        ]);

        return $permission->fresh();
    }
}
