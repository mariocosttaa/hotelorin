<?php

use App\Http\Controllers\Panel\PainelLoginController;
use App\Http\Controllers\Panel\PanelDashboardController;
use App\Http\Controllers\Panel\PanelIndexController;
use App\Http\Controllers\Panel\PanelRoomsController;
use App\Http\Middleware\SetLocaleMiddleware;
use App\Http\Middleware\TenantAuthMiddleware;
use App\Http\Middleware\UserPermissionAccessMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;




Route::middleware('guest')->group(function () {
    Route::middleware([SetLocaleMiddleware::class])->group(function () {
        Route::prefix('{locale}')->group(function () {

            //Login Page
            Route::get('/login', PainelLoginController::class)->name('panel-login');
        });
    });
});


Route::middleware('auth')->group(function () {
    Route::middleware([SetLocaleMiddleware::class])->group(function () {
        Route::prefix('{locale}')->group(function () {


            // Index Page
            Route::get('panel', PanelIndexController::class)->name('panel-index');

            // Panel Routes
            Route::prefix('panel/{tenantId}')
                ->middleware([TenantAuthMiddleware::class, UserPermissionAccessMiddleware::class])
                ->group(function () {

                    //Dashboard Page
                    Route::get('/', PanelDashboardController::class)->name('panel-dashboard');

                    // Rooms
                    Route::prefix('room')->group(function () {
                        //Rooms Index Page
                        Route::get('/', [PanelRoomsController::class, 'index'])->name('panel-room-index');

                        //Rooms Create Page
                        Route::get('/create', [PanelRoomsController::class, 'create'])->name('panel-room-create');

                        //Rooms Edit Page
                        Route::get('/{roomIdHashed}/edit', [PanelRoomsController::class, 'edit'])->name('panel-room-edit');

                        //Rooms Show Page
                        Route::get('/{roomIdHashed}', [PanelRoomsController::class, 'show'])->name('panel-room-show');

                        //Rooms Delete Page
                        Route::delete('/{roomIdHashed}', [PanelRoomsController::class, 'destroy'])->name('panel-room-destroy');
                    });
                });


        });
    });
});
