<?php

namespace App\Http\Controllers\Panel;

use App\Http\Controllers\Controller;
use App\Http\Resources\Manager\TenantResource;
use App\Models\Manager\UserTenantModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PanelDashboardController extends Controller
{
    /**
     * Show the portal home page.
     */
    public function __invoke(Request $request): \Inertia\Response
    {
        return Inertia::render('frontend-panel/pages/Dashboard/PanelDashboard');
    }
}
