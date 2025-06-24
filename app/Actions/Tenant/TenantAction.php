<?php

namespace App\Actions\Tenant;

use App\Models\Manager\TenantModel;
use App\Models\Manager\UserTenantModel;
use Illuminate\Support\Facades\Log;
use App\Actions\Tenant\TenantTableStructure;

class TenantAction
{
    public static function set(int $userId, array $tenantModelData): TenantModel|false {
        try {
            //create tenant model data
            $tenantModel = self::createInTenantModel(arguments: $tenantModelData);
            //seting user tenant
            UserTenantModel::create([
                'user_id' => $userId,
                'tenant_id' => $tenantModel->id,
            ]);
            //seting TenantDatabases
            $tenantId = $tenantModel->id;
            // Criar estrutura de tabelas do tenant
            foreach (TenantTableStructure::getMigrations() as $migrationClass) {
                (new $migrationClass($tenantId))->up();
            }
            Log::info('TenantAction - New Tenant Created with ID: ' . $tenantModel->id);
            return $tenantModel;
        } catch (\Exception $e) {
            throw new \Exception('TenantAction - Error creating tenant: ' . $e->getMessage());
        }
    }

    /**
     * Create a new tenant model with a unique name and slug.
     *
     * @param bool $generateUniqName Whether to generate a unique name and slug.
     * @param array $arguments The arguments for creating the tenant model.
     * @return TenantModel The created tenant model.
     */
    private static function createInTenantModel(array $arguments): TenantModel {
        // Check if tenant is already created
        do {
            if(empty($arguments['slug']) || empty($arguments['name'])) {
                $arguments['name'] = 'tenant-' . uniqid();
                $arguments['slug'] = 'tenant-' . uniqid();
            }
        } while (TenantModel::where('slug', $arguments['slug'])->exists());
        // Create invoice in Subscription Invoices
       return TenantModel::create($arguments);
    }
}
