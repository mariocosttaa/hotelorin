<?php

namespace Database\Seeders\Tenant;

use Illuminate\Database\Seeder;

class _TenantDefaultSeeder extends Seeder
{
    protected $tenantId;

    public function __construct($tenantId = null)
    {
        $this->tenantId = $tenantId;
    }

    public function run($tenantId = null)
    {
        $tenantId = $tenantId ?? $this->tenantId;
        if (!$tenantId) {
            throw new \InvalidArgumentException('Tenant ID is required.');
        }

        // Set tenant connection context if needed (if using multi-DB)
        // You may need to set the connection dynamically here if your app requires it

        $this->call([
            RankSeeder::class,
            SectorSeeder::class,
        ]);
    }
}
