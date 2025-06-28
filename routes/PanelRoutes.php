<?php

use App\Http\Controllers\Panel\PainelLoginController;
use App\Http\Controllers\Panel\PanelDashboardController;
use App\Http\Controllers\Panel\PanelIndexController;
use App\Http\Controllers\Panel\PanelRoomsController;
use App\Http\Controllers\Panel\PanelRoomsTypeController;
use App\Http\Middleware\TenantAuthMiddleware;
use App\Http\Middleware\UserPermissionAccessMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;




Route::middleware(['guest', \App\Http\Middleware\SetLocaleMiddleware::class])->group(function () {
    //Login Page
    Route::get('/{locale}/login', PainelLoginController::class)->name('panel-login');
});


Route::middleware('auth')->group(function () {
    // Index Page
    Route::get('panel', PanelIndexController::class)->name('panel-index');

    // Panel Routes
    Route::prefix('panel/{tenantId}')
        ->middleware([TenantAuthMiddleware::class, UserPermissionAccessMiddleware::class])
        ->group(function () {

            //Dashboard Page
            Route::get('/', PanelDashboardController::class)->name('panel-dashboard');

            // Room Types (must come before room routes to avoid conflicts)
            Route::prefix('room/type')->group(function () {
                //Room Types Index Page
                Route::get('/', [PanelRoomsTypeController::class, 'index'])->name('panel-room-type-index');

                //Room Types Create Page
                Route::get('/create', [PanelRoomsTypeController::class, 'create'])->name('panel-room-type-create');

                //Room Types Store Page
                Route::post('/store', [PanelRoomsTypeController::class, 'store'])->name('panel-room-type-store');

                //Room Types Edit Page
                Route::get('/edit/{roomTypeIdHashed}', [PanelRoomsTypeController::class, 'edit'])->name('panel-room-type-edit');

                //Room Types Update Page
                Route::post('update/{roomTypeIdHashed}', [PanelRoomsTypeController::class, 'update'])->name('panel-room-type-update');

                //Room Types Delete Page
                Route::delete('/delete/{roomTypeIdHashed}', [PanelRoomsTypeController::class, 'destroy'])->name('panel-room-type-destroy');

                //Room Types Gallery Delete
                Route::delete('/gallery/{roomTypeIdHashed}/{galleryIdHashed}', [PanelRoomsTypeController::class, 'destroyGallery'])->name('panel-room-type-gallery-destroy');
            });

            // Rooms
            Route::prefix('room')->group(function () {
                //Rooms Index Page
                Route::get('/', [PanelRoomsController::class, 'index'])->name('panel-room-index');

                //Rooms Create Page
                Route::get('/create', [PanelRoomsController::class, 'create'])->name('panel-room-create');

                //Rooms Store Page
                Route::post('/store', [PanelRoomsController::class, 'store'])->name('panel-room-store');

                //Rooms Edit Page
                Route::get('/edit/{roomIdHashed}', [PanelRoomsController::class, 'edit'])->name('panel-room-edit');

                //Rooms Update Page
                Route::post('/update/{roomIdHashed}', [PanelRoomsController::class, 'update'])->name('panel-room-update');

                //Rooms Delete Page
                Route::delete('/delete/{roomIdHashed}', [PanelRoomsController::class, 'destroy'])->name('panel-room-destroy');

                //Rooms Gallery Delete
                Route::delete('/gallery/{roomIdHashed}/{galleryIdHashed}', [PanelRoomsController::class, 'destroyGallery'])->name('panel-room-gallery-destroy');
            });
        });

    // Add this after other panel routes
    Route::post('/panel/user/language', [\App\Http\Controllers\Panel\PanelProfileController::class, 'update'])->name('panel-user-language-update');
});
