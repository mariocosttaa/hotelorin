<?php

namespace App\Http\Controllers\Panel;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PainelLoginController extends Controller
{
    public function __invoke(Request $request)
    {
        return Inertia::render('frontend-panel/pages/Login/PanelLogin');
    }
}