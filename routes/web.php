<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/dev/test-panel', function () {
    return Inertia::render('frontend-panel/pages/TestPanelPage');
});

require __DIR__.'/auth.php';
require __DIR__.'/PanelRoutes.php';
require __DIR__.'/PublicRoutes.php';
require __DIR__.'/WebHooksRoutes.php';



