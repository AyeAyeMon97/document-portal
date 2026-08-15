<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreDocumentRequest;
use App\Http\Resources\DocumentResource;
use App\Services\DocumentService;
use App\Traits\ApiResponseTrait;
use App\Models\Document;
use Illuminate\Support\Facades\Storage; 

class DocumentController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private DocumentService $documentService
    ) {}

    public function index()
    {
        $documents = $this->documentService->getAll();

        return DocumentResource::collection($documents);
    }

    public function store(StoreDocumentRequest $request)
    {
        $document = $this->documentService->create(
            auth('api')->user(),
            $request->validated(),
            $request->file('file')
        );

        return $this->success(
            new DocumentResource($document->load('user')),
            'Document uploaded successfully',
            201
        );
    }

    public function destroy(string $id)
    {
        $document = Document::findOrFail($id);

        $this->documentService->delete(
            $document,
            auth('api')->user()
        );

        return $this->success(
            null,
            'Document deleted successfully'
        );
    }

    public function download(Document $document)
    {
        abort_unless(
            Storage::disk('local')->exists($document->file_path),
            404
        );

        return Storage::disk('local')->download(
            $document->file_path,
            $document->file_name
        );
    }
}
