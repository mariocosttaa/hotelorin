<?php

namespace App\Http\Controllers;

use App\Actions\General\EasyHashAction;

abstract class Controller
{

    public function getTenantId(): int
    {
        return config('tenantId');
    }

    public function getTenantIdHashed(): string
    {
        return EasyHashAction::encode(config('tenantId'), 'tenant-id');
    }

    public function localeAndTenantArray(): array
    {
        $tenantId = config('tenantId');
        $tenantIdHashed = EasyHashAction::encode($tenantId, 'tenant-id');
        $locale = app()->getLocale();
        return [
            'locale' => $locale,
            'tenantId' => $tenantIdHashed,
        ];
    }

    public function localeArray(): array
    {
        $locale = app()->getLocale();
        return [
            'locale' => $locale,
        ];
    }
}
