<?php

use App\Http\Controllers\TenantFileController;
use App\Http\Middleware\TenantAuthPrivateFiles;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/dev/test-panel', function () {
    return Inertia::render('frontend-panel/pages/TestPanelPage');
});

// Files Routes
Route::prefix('file/{tenantIdHashed}')->group(function () {

    // Public Files
    Route::get('/{filePath?}', [TenantFileController::class, 'showPublic'])
        ->name('tenant-file-show-public')
        ->where('filePath', '.*');

    // Private Files
    Route::get('/company/{filePath}', [TenantFileController::class, 'showPrivate'])
        ->middleware(TenantAuthPrivateFiles::class)
        ->name('tenant-file-show-private')
        ->where('filePath', '.*');

});


require __DIR__ . '/auth.php';
require __DIR__ . '/PanelRoutes.php';
require __DIR__ . '/PublicRoutes.php';
require __DIR__ . '/WebHooksRoutes.php';
