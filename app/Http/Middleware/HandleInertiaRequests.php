<?php

namespace App\Http\Middleware;


use App\Actions\General\EasyHashAction;
use App\CustomCache\Auth\AuthCache;
use App\CustomCache\CustomCacheAction;
use App\CustomCache\Model\Manager\CurrencyCacheModel;
use App\Http\Resources\Manager\CurrencyResource;
use App\Http\Resources\Manager\TenantResource;
use App\Http\Resources\Manager\UserResource;
use App\Models\Manager\CurrencyModel;
use App\Models\Manager\TenantModel;
use App\Models\Manager\UserModel;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Middleware;
use Pest\ArchPresets\Custom;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }


    //return defaultcurrency on base
    public function defaultCurrencyCode() {
        return match(app()->getLocale()) {
            'en' => 'usd',
            'es' => 'eur',
            'fr' => 'eur',
            'pt' => 'eur',
            default => env('APP_DEFAULT_CURRENCY', 'usd'),
        };
    }


    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared--
     *
     * @return array<string, mixed>
     */
    public function share(Request $request)
    {

        //determine tenant id from url
        $url = $request->url();
        $path = $request->path();

        $tenantGet = $this->getTenant($request, $url, $path);
        $tenantModel = $tenantGet->model;
        $tenantId = $tenantGet->idHashed;

        // Debug: Log the URL and extracted tenantId
        Log::info('HandleInertiaRequests - Full URL: ' . $url);
        Log::info('HandleInertiaRequests - Path: ' . $path);
        Log::info('HandleInertiaRequests - TenantId: ' . ($tenantId ?? 'null'));

        return [
            ...parent::share($request),
            'tenantId' => $tenantId,
            'tenant' => $tenantModel ? new TenantResource($tenantModel)->resolve() : null,
            'locale' => app()->getLocale(),
            'currencies' => CurrencyResource::collection(CurrencyCacheModel::all())->resolve(),
            'default_currency' => $this->defaultCurrencyCode(),
            'name' => config('app.name'),
            'auth' => [
                'user' => AuthCache::getUser($request)
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'toast' => fn () => $request->session()->get('toast'),
        ];
    }



    private function getTenant(Request $request, string $url, string $path): object {
        if (preg_match('/\/panel\/([a-zA-Z0-9]+)\//', $url, $matches)) {
            $tenantIdHashed = $matches[1];
        } elseif (preg_match('/panel\/([a-zA-Z0-9]+)/', $path, $matches)) {
            $tenantIdHashed = $matches[1];
        } elseif (preg_match('/panel\/([a-zA-Z0-9]+)$/', $path, $matches)) {
            $tenantIdHashed = $matches[1];
        } else {
            $tenantIdHashed = null;
        }

        //Get Tenant
        if($tenantIdHashed) {
            $tenantId = EasyHashAction::decode($tenantIdHashed, 'tenant-id', 21);
            $tenant = TenantModel::where('id', $tenantId)->first();
            if($tenant) {
                config(['tenantId' => $tenantId]);
                $request->merge(['tenant-model' => $tenant]);
            }
        }

        return (object ) [
            'model' => $tenant ?? null,
            'idHashed'  => $tenantIdHashed ?? null
        ];
    }

}
