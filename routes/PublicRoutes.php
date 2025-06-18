<?php

use App\Http\Controllers\Public\PublicHomeController;
use App\Http\Controllers\Public\PublicHotelController;
use App\Http\Middleware\SetLocaleMiddleware;
use Illuminate\Support\Facades\Route;

// home
Route::get('/', PublicHomeController::class)->name('public-home');

// Aplica middleware de localização para todas as rotas
Route::middleware(SetLocaleMiddleware::class)->group(function () {
    // Agrupa rotas com prefixo de localização
    Route::prefix('{locale}')->group(function () {

        //Index Page
        Route::get('/', PublicHomeController::class)->name('public-home');

        // Hotel Page
        Route::get('/{tenantSlug}', [PublicHotelController::class, 'index'])->name('public-hotel');

    });
});

