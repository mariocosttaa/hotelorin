<?php

// app/Http/Middleware/TenantAuthMiddleware.php

namespace App\Http\Middleware;

use App\Actions\General\EasyHashAction;
use App\Models\Manager\TenantModel;
use Closure;
use Illuminate\Http\Request;

/**
 * Middleware to ensure that the authenticated user is accessing a valid tenant.
 *
 * This middleware checks for the presence of a tenantId in the route parameters,
 * decodes it, and verifies that the tenant exists in the database. If the tenant
 * is found, it is merged into the request for downstream usage.
 */
class TenantAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request  The current HTTP request instance.
     * @param  \Closure  $next  The next middleware or request handler.
     * @return mixed
     *
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     *         If the tenantId is missing or the tenant cannot be found.
     */
    public function handle(Request $request, Closure $next)
    {
        // Retrieve the tenantId from the route parameters.
        $tenantIdHashed= $request->route('tenantId');
        if (!$tenantIdHashed) {
            abort(404, 'Tenant not found');
        }

        // Attempt to get the tenant model from the request (may be set by previous middleware).
        $tenantModel = $request->get('tenant-model');
        if (!$tenantModel) {

            // If not present, decode the tenantId and fetch the tenant from the database.
            $tenantId = EasyHashAction::decode($tenantIdHashed, 'tenant-id', 21);
            $tenant = TenantModel::where('id', $tenantId)->first();

            if ($tenant) {
                // Store the tenantId in the config and merge the tenant model into the request.
                config(['tenantId' => $tenantId]);
                $request->merge(['tenant-model' => $tenant]);
            } else {
                // Abort with 404 if the tenant does not exist.
                abort(404, 'Tenant not found');
            }
        }

        // Continue processing the request.
        return $next($request);
    }
}
