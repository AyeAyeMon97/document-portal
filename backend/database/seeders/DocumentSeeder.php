<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Document;
use App\Models\User;

class DocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where(
            'email',
            'admin@workspace.com'
        )->first();

        $member1 = User::where(
            'email',
            'member1@workspace.com'
        )->first();

        $member2 = User::where(
            'email',
            'member2@workspace.com'
        )->first();

        $documents = [
            [
                'user_id' => $admin->id,
                'title' => 'Company Policy',
                'file_name' => 'company-policy.pdf',
            ],
            [
                'user_id' => $admin->id,
                'title' => 'Employee Handbook',
                'file_name' => 'employee-handbook.pdf',
            ],
            [
                'user_id' => $member1->id,
                'title' => 'Project Guidelines',
                'file_name' => 'project-guidelines.pdf',
            ],
            [
                'user_id' => $member1->id,
                'title' => 'Development Guide',
                'file_name' => 'development-guide.pdf',
            ],
            [
                'user_id' => $member2->id,
                'title' => 'Security Policy',
                'file_name' => 'security-policy.pdf',
            ],
        ];

        foreach ($documents as $document) {
            Document::create([
                ...$document,
                'file_path' => 'documents/' . $document['file_name'],
                'file_size' => 0,
                'mime_type' => 'application/pdf',
            ]);
        }
    }
}
