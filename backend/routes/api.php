<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\DocumentController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth:api')->group(function () {

    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);

        Route::post('/logout', [AuthController::class, 'logout']);
    });

    // Admin
    Route::middleware('admin')->group(function () {
        Route::post('/users', [UserController::class, 'store']);
    });

    // Documents
    Route::apiResource('documents', DocumentController::class)->only([
        'index',
        'store',
        'destroy',
    ]);
});

Route::get('/documents/{document}/download', [
    DocumentController::class,
    'download'
]);
