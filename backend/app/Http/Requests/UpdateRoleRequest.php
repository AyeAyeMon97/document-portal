<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth('api')->check()
            && auth('api')->user()->hasPermission('roles.manage');
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $roleId = $this->route('role');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                'alpha_dash',
                Rule::unique('roles', 'slug')->ignore($roleId),
            ],
            'description' => ['nullable', 'string', 'max:500'],
            'permission_ids' => ['sometimes', 'array'],
            'permission_ids.*' => ['uuid', 'exists:permissions,id'],
        ];
    }
}
