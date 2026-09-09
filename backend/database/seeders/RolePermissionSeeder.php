<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            [
                'slug' => 'documents.view',
                'name' => 'View Documents',
                'description' => 'Can list and view documents',
            ],
            [
                'slug' => 'documents.create',
                'name' => 'Create Documents',
                'description' => 'Can upload new documents',
            ],
            [
                'slug' => 'documents.update',
                'name' => 'Update Documents',
                'description' => 'Can edit documents',
            ],
            [
                'slug' => 'documents.delete',
                'name' => 'Delete Documents',
                'description' => 'Can delete documents',
            ],
            [
                'slug' => 'documents.download',
                'name' => 'Download Documents',
                'description' => 'Can download document files',
            ],
            [
                'slug' => 'users.create',
                'name' => 'Create Users',
                'description' => 'Can create team accounts',
            ],
            [
                'slug' => 'users.view',
                'name' => 'View Users',
                'description' => 'Can view team accounts',
            ],
            [
                'slug' => 'roles.view',
                'name' => 'View Roles',
                'description' => 'Can view roles',
            ],
            [
                'slug' => 'roles.manage',
                'name' => 'Manage Roles',
                'description' => 'Can create and update roles and their permissions',
            ],
            [
                'slug' => 'permissions.view',
                'name' => 'View Permissions',
                'description' => 'Can view permissions',
            ],
        ];

        $permissionIds = [];

        foreach ($permissions as $permission) {
            $model = Permission::query()->updateOrCreate(
                ['slug' => $permission['slug']],
                [
                    'name' => $permission['name'],
                    'description' => $permission['description'],
                ]
            );

            $permissionIds[$permission['slug']] = $model->id;
        }

        $admin = Role::query()->updateOrCreate(
            ['slug' => 'admin'],
            [
                'name' => 'Admin',
                'description' => 'Full access to the document portal',
            ]
        );

        $member = Role::query()->updateOrCreate(
            ['slug' => 'member'],
            [
                'name' => 'Member',
                'description' => 'Can manage documents with limited access',
            ]
        );

        $admin->permissions()->sync(array_values($permissionIds));

        $member->permissions()->sync([
            $permissionIds['documents.view'],
            $permissionIds['documents.create'],
            $permissionIds['documents.update'],
            $permissionIds['documents.delete'],
            $permissionIds['documents.download'],
        ]);
    }
}
