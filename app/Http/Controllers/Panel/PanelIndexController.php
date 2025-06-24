<?php

namespace App\Http\Controllers\Panel;

use App\Http\Controllers\Controller;
use App\Http\Resources\Manager\TenantResource;
use App\Models\Manager\UserModel;
use App\Models\Manager\UserTenantModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PanelIndexController extends Controller
{
    public function __invoke()
    {

        //get all tenants
        $userId = Auth::user()->id;
        $userTenant = UserTenantModel::with('tenant')->where('user_id', $userId)->get();
        if($userTenant->count() > 0) {
            $tenantsArray = $userTenant->pluck('tenant');
            $userTenantsResource = TenantResource::collection($tenantsArray)->resolve();
        }

        return Inertia::render('frontend-panel/pages/Index/PanelIndex', [
            'tenants' => $userTenantsResource
        ]);
    }
}