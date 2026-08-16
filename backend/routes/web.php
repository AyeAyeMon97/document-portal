<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\DocumentController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/documents/{document}/download', [
    DocumentController::class,
    'download'
]);
