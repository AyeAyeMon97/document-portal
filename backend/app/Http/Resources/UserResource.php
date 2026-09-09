<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $this->resource->loadMissing('role.permissions');

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role_id' => $this->role_id,
            // Keep string role for existing frontend checks (isAdmin)
            'role' => $this->role?->slug,
            'role_detail' => $this->when(
                $this->relationLoaded('role') && $this->role,
                fn () => [
                    'id' => $this->role->id,
                    'name' => $this->role->name,
                    'slug' => $this->role->slug,
                ]
            ),
            'permissions' => $this->permissionSlugs(),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
