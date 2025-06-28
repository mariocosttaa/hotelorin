<?php

namespace App\Http\Middleware;


use App\Actions\General\EasyHashAction;
use App\CustomCache\Auth\AuthCache;
use App\CustomCache\CustomCacheAction;
use App\CustomCache\Model\Manager\CurrencyCacheModel;
use App\Http\Resources\Manager\CurrencyResource;
use App\Http\Resources\Manager\TenantResource;
use App\Http\Resources\Manager\UserResource;
use App\Http\Resources\Tenant\RankResource;
use App\Http\Resources\Tenant\SectorResource;
use App\Http\Resources\Tenant\SettingResource;
use App\Models\Manager\CurrencyModel;
use App\Models\Manager\TenantModel;
use App\Models\Manager\UserModel;
use App\Models\Manager\UserRankModel;
use App\Models\Manager\UserSectorModel;
use App\Models\Tenant\RankModel;
use App\Models\Tenant\SettingModel;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        // Determine if this is a panel/auth route (no locale in URL) or public (locale in URL)
        $path = $request->path();
        $isPanelOrAuth = preg_match('/^(panel|auth)/', $path);

        if ($isPanelOrAuth) {
            // Try to get locale from authenticated user or cookie
            $user = Auth::user();
            $locale = null;
            if ($user && isset($user->language)) {
                $locale = $user->language;
            } elseif ($request->hasCookie('locale')) {
                $locale = $request->cookie('locale');
            } else {
                $locale = config('app.locale');
            }
            app()->setLocale($locale);
        }
        // For public, SetLocaleMiddleware will already set the locale from the URL

        //determine tenant id from url
        $url = $request->url();
        $path = $request->path();

        $tenantGet = $this->getTenantAndSetting($request, $url, $path);
        $tenantModel = $tenantGet->model;
        $tenantIdHashed = $tenantGet->idHashed;
        $setting = $tenantGet->setting;

        // Debug: Log the URL and extracted tenantId
        Log::info('HandleInertiaRequests - Full URL: ' . $url);
        Log::info('HandleInertiaRequests - Path: ' . $path);
        Log::info('HandleInertiaRequests - TenantId: ' . ($tenantIdHashed ?? 'null'));

        //

        return [
            ...parent::share($request),
            ...$this->whereIsAuthAndInTenant($tenantIdHashed, $tenantModel, $setting),

            'locale' => app()->getLocale(),
            'currencies' => CurrencyResource::collection(CurrencyCacheModel::all())->resolve(),
            'default_currency' => $this->defaultCurrencyCode(),
            'name' => config('app.name'),
            'auth' => [
                ...$this->auth($request, $tenantModel)
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'toast' => fn () => $request->session()->get('toast'),
        ];
    }

    private function whereIsAuthAndInTenant($tenantIdHashed, $tenantModel, $setting) {

        return [
            'tenantId' => $tenantIdHashed,
            'tenant' => $tenantModel ? new TenantResource($tenantModel)->resolve() : null,
            'setting' => $setting ? new SettingResource($setting)->resolve() : null,
        ];
    }

    private function auth(request $request, $tenantModel): array {

        //check if user are Auth, and if not, return null
        $user = AuthCache::getUser($request);
        if(!$user || !$tenantModel) { return ['user' => $user, 'rank' => null, 'sector' => null]; }

        //verify Rank
        $userRank = UserRankModel::where('user_id', $user->id)->where('tenant_id', $tenantModel->id)->first();
        if ($userRank) {
            $request->merge(['user-rank-model' => $userRank]);
        }

        //verify Sector
        $userSector = UserSectorModel::where('user_id', $user->id)->where('tenant_id', $tenantModel->id)->first();
        if ($userSector) {
            $request->merge(['user-sector-model' => $userSector]);
        }

        return [
            'user' => $user = AuthCache::getUser($request),
            'rank' => $tenantModel ? new RankResource($userRank->rank)->resolve() : null,
            'sector' => $tenantModel ? new SectorResource($userSector->sector)->resolve() : null,
        ];
    }

    private function getTenantAndSetting(Request $request, string $url, string $path): object {

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
                $setting = SettingModel::first();
                $request->merge(['setting-model' => $setting]);
            }
        }

        return (object ) [
            'model' => $tenant ?? null,
            'idHashed'  => $tenantIdHashed ?? null,
            'setting' => $setting ?? null,
        ];
    }

}
