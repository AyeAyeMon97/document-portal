<?php

namespace App\Services;

use App\Models\Document;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DocumentService
{
    public function getAll()
    {
        return Document::query()
            ->with('user:id,name,email')
            ->latest()
            ->paginate(10);
    }

    public function create(
        User $user,
        array $data,
        UploadedFile $file
    ): Document {
        return DB::transaction(function () use (
            $user,
            $data,
            $file
        ) {
            $path = $file->store('documents', 'local');

            return Document::create([
                'user_id' => $user->id,
                'title' => $data['title'],
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $path,
                'file_size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
            ]);
        });
    }

    public function update(
        User $user,
        Document $document,
        array $data,
        ?UploadedFile $file = null
    ): Document {
        if ($document->user_id !== $user->id) {
            abort(
                403,
                'You can only update your own document.'
            );
        }

        return DB::transaction(function () use (
            $user,
            $document,
            $data,
            $file
        ) {
            $updateData = [];

            // Update title
            if (array_key_exists('title', $data)) {
                $updateData['title'] = $data['title'];
            }
            // If new file uploaded
            if ($file) {
                // Delete old file
                if ($document->file_path) {
                    Storage::disk('local')->delete(
                        $document->file_path
                    );
                }
                // Store new file
                $path = $file->store(
                    'documents',
                    'local'
                );
                $updateData['file_name'] = $file->getClientOriginalName();
                $updateData['file_path'] = $path;
                $updateData['file_size'] = $file->getSize();
                $updateData['mime_type'] = $file->getMimeType();
            }

            $document->update($updateData);

            return $document->fresh();
        });
    }

    public function delete(
        Document $document,
        User $user
    ): void {
        if ($document->user_id !== $user->id) {
            abort(
                403,
                'You can only delete your own document.'
            );
        }

        DB::transaction(function () use ($document) {
            Storage::disk('local')->delete(
                $document->file_path
            );

            $document->delete();
        });
    }
}
