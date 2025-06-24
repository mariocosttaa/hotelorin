<?php

// app/Http/Middleware/TenantAuthMiddleware.php

namespace App\Http\Middleware;

use App\Actions\General\EasyHashAction;
use App\Models\Manager\TenantModel;
use Closure;
use Illuminate\Http\Request;

class TenantAuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {

        $tenantId = $request->route('tenantId');

        if (!$tenantId) {
            abort(404, 'Tenant not found');
        }

        //Decoded the tenant id
        $tenantId = EasyHashAction::decode($tenantId, 'tenant-id', 21);

        $tenant = TenantModel::find($tenantId);
        if (!$tenant) {
            abort(404);
        }

        config(['tenantId' => $tenantId]);

        // Share tenant ID with request
        $request->merge(['tenant' => $tenant]);
        return $next($request);
    }
}
