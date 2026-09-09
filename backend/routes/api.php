<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\DocumentController;
use App\Http\Controllers\API\PermissionController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\API\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth:api')->group(function () {

    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    Route::middleware('permission:users.view')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
    });

    Route::middleware('permission:users.create')->group(function () {
        Route::post('/users', [UserController::class, 'store']);
    });

    Route::middleware('permission:roles.view')->group(function () {
        Route::get('/roles', [RoleController::class, 'index']);
        Route::get('/roles/{role}', [RoleController::class, 'show']);
    });

    Route::middleware('permission:roles.manage')->group(function () {
        Route::post('/roles', [RoleController::class, 'store']);
        Route::put('/roles/{role}', [RoleController::class, 'update']);
        Route::patch('/roles/{role}', [RoleController::class, 'update']);
        Route::delete('/roles/{role}', [RoleController::class, 'destroy']);
        Route::put('/roles/{role}/permissions', [RoleController::class, 'syncPermissions']);
        Route::post('/permissions', [PermissionController::class, 'store']);
    });

    Route::middleware('permission:permissions.view')->group(function () {
        Route::get('/permissions', [PermissionController::class, 'index']);
        Route::get('/permissions/{permission}', [PermissionController::class, 'show']);
    });

    Route::get('/documents', [DocumentController::class, 'index'])
        ->middleware('permission:documents.view');

    Route::post('/documents', [DocumentController::class, 'store'])
        ->middleware('permission:documents.create');

    Route::put('/documents/{document}', [DocumentController::class, 'update'])
        ->middleware('permission:documents.update');

    Route::patch('/documents/{document}', [DocumentController::class, 'update'])
        ->middleware('permission:documents.update');

    Route::delete('/documents/{document}', [DocumentController::class, 'destroy'])
        ->middleware('permission:documents.delete');

    Route::get('/documents/{document}/download', [DocumentController::class, 'download'])
        ->middleware('permission:documents.download');
});
