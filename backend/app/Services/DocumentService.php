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
