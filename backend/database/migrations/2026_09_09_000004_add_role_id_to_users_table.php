<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $adminRoleId = (string) Str::uuid();
        $memberRoleId = (string) Str::uuid();

        DB::table('roles')->insert([
            [
                'id' => $adminRoleId,
                'name' => 'Admin',
                'slug' => 'admin',
                'description' => 'Full access to the document portal',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => $memberRoleId,
                'name' => 'Member',
                'slug' => 'member',
                'description' => 'Can manage documents with limited access',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

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
            $id = (string) Str::uuid();
            $permissionIds[$permission['slug']] = $id;

            DB::table('permissions')->insert([
                'id' => $id,
                'name' => $permission['name'],
                'slug' => $permission['slug'],
                'description' => $permission['description'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        foreach ($permissionIds as $permissionId) {
            DB::table('permission_role')->insert([
                'role_id' => $adminRoleId,
                'permission_id' => $permissionId,
            ]);
        }

        foreach ([
            'documents.view',
            'documents.create',
            'documents.update',
            'documents.delete',
            'documents.download',
        ] as $slug) {
            DB::table('permission_role')->insert([
                'role_id' => $memberRoleId,
                'permission_id' => $permissionIds[$slug],
            ]);
        }

        Schema::table('users', function (Blueprint $table) {
            $table->foreignUuid('role_id')
                ->nullable()
                ->after('name')
                ->constrained('roles')
                ->restrictOnDelete();
        });

        if (Schema::hasColumn('users', 'role')) {
            DB::table('users')
                ->where('role', 'admin')
                ->update(['role_id' => $adminRoleId]);

            DB::table('users')
                ->whereNull('role_id')
                ->update(['role_id' => $memberRoleId]);

            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('role');
            });
        } else {
            DB::table('users')
                ->whereNull('role_id')
                ->update(['role_id' => $memberRoleId]);
        }
    }

    public function down(): void
    {
        if (! Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->enum('role', ['admin', 'member'])
                    ->default('member')
                    ->after('name');
            });
        }

        if (Schema::hasColumn('users', 'role_id')) {
            $adminRoleId = DB::table('roles')->where('slug', 'admin')->value('id');
            $memberRoleId = DB::table('roles')->where('slug', 'member')->value('id');

            if ($adminRoleId) {
                DB::table('users')
                    ->where('role_id', $adminRoleId)
                    ->update(['role' => 'admin']);
            }

            if ($memberRoleId) {
                DB::table('users')
                    ->where('role_id', $memberRoleId)
                    ->update(['role' => 'member']);
            }

            Schema::table('users', function (Blueprint $table) {
                $table->dropConstrainedForeignId('role_id');
            });
        }

        DB::table('permission_role')->delete();
        DB::table('permissions')->delete();
        DB::table('roles')->delete();
    }
};
