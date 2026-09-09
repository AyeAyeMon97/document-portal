<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth('api')->check()
            && auth('api')->user()->hasPermission('users.create');
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'email' => [
                'required',
                'email',
                'unique:users,email',
            ],
            'password' => [
                'required',
                'string',
                'min:8',
            ],
            'role_id' => [
                'nullable',
                'uuid',
                'exists:roles,id',
                'required_without:role',
            ],
            'role' => [
                'nullable',
                'string',
                'required_without:role_id',
                Rule::exists('roles', 'slug'),
            ],
        ];
    }
}
