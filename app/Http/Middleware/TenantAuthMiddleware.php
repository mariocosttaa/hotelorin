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

        $tenantModel = $request->get('tenant-model');
        if (!$tenantModel) {
            abort(404);
        }

        config(['tenantId' => $tenantModel->id]);

        // Share tenant ID with request
        $request->merge(['tenant' => $tenantModel]);
        return $next($request);
    }
}
