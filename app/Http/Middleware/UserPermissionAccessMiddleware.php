<?php

// app/Http/Middleware/TenantAuthMiddleware.php

namespace App\Http\Middleware;

use App\Models\Manager\UserRankModel;
use App\Models\Manager\UserTenantModel;
use App\Models\Tenant\PermissionModel;
use App\Models\Tenant\PermissionUserModel;
use Closure;
use Illuminate\Http\Request;

class UserPermissionAccessMiddleware
{
    public function handle(Request $request, Closure $next)
    {

        $tenantId = $request->get('tenant')->id;
        $userId = $request->user()->id;

        //Verify if the user has access to the tenant
        $userTenant = UserTenantModel::where('user_id', $userId)->where('tenant_id', $tenantId)->first();
        if (!$userTenant) {
            abort(403, __('You dont Have Permission to access this page'));
        }


        //Get User Rank of this Tenant
        $userRank = UserRankModel::where('tenant_id', $tenantId)->first();
        if (!$userRank) {
            abort(403, __('You dont Have Permission to access this page'));
        }

        $userRankLevel = $userRank->rank->level;
        $pageName = $request->route()->getName();
        $pageLink = $this->getPageLink($request);

        //verify in Permissions Page
        $permissionPage = PermissionModel::where('page', $pageName)->orWhere('page_link', $pageLink)->first();
        if (!$permissionPage) {
            //if not found, verify in permisions page
            return $next($request);
        }

        $userPermission = $this->verifyUserAndRankPermissionInMethod($userId, $userRankLevel, $permissionPage);

        if($userPermission == false){
            abort(403, __('You dont Have Permission to access this page'));
        }

        return $next($request);
    }

    private function verifyUserAndRankPermissionInMethod(int $userId, int $rankLevel, PermissionModel $permissionPage): bool
    {

        //verify by Rank
        $accessByRankBool = $rankLevel >= $permissionPage->minimum_rank_level;

        //verify by Permission User if not have user customizon of permisssion, return verifiation by rank
        $permissionUser = PermissionUserModel::where('user_id', $userId)->where('permission_id', $permissionPage->id)->first();
        if (!$permissionUser) {
            return $accessByRankBool;
         }

        return $permissionUser->access;

    }


    private function getPageLink(Request $request): string
    {
        // Adjust $pageLink to start after 'panel/' and not include http, locale, etc.
        $uri = $request->getRequestUri(); // e.g. /en/panel/123/room/create
        // Remove leading slash
        $uri = ltrim($uri, '/');
        // Remove locale prefix (assume it's always the first segment)
        $segments = explode('/', $uri);
        if (count($segments) > 1) {
            array_shift($segments); // remove locale
        }
        // Find the position of 'panel' and build the path from there
        $panelIndex = array_search('panel', $segments);
        if ($panelIndex !== false) {
            $pageLink = implode('/', array_slice($segments, $panelIndex));
        } else {
            $pageLink = implode('/', $segments);
        }

        return $pageLink;
    }
}
