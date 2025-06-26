<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class PanelAuthenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo($request)
    {
        // Redirect to the 'panel-login' route if the user is not authenticated
        if (!$request->expectsJson()) {
            return route('panel-login');
        }
    }
}
