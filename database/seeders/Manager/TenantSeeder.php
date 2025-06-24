<?php

namespace Database\Seeders\Manager;

use App\Models\Manager\TenantModel;
use App\Models\Manager\UserTenantModel;
use App\Models\Manager\UserModel;
use App\Models\Manager\SubscriptionModel;
use App\Models\Manager\SubscriptionPriceModel;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Carbon\Carbon;

class TenantSeeder extends Seeder
{
    public function run(): void
    {
        // Get existing users, subscriptions, and subscription prices
        $user  = UserModel::first();
        $subscription = SubscriptionModel::first();
        $subscriptionPrice = SubscriptionPriceModel::first();

        if (!$user || !$subscription || !$subscriptionPrice) {
            $this->command->warn('Skipping TenantSeeder: Missing required data (user, subscription, or subscription price)');
            return;
        }

        $tenantData = [
            'name' => 'Test Tenant',
            'slug' => 'test-tenant',
            'subscription_id' => $subscription->id,
            'subscription_price_id' => $subscriptionPrice->id,
            'payment_date' => now()->subDays(5),
            'expiration_date' => now()->addMonths(6),
            'owner_user_id' => $user->id,
            'status' => true,
        ];

        // Create tenant
        $tenant = TenantModel::create($tenantData);

        // Create user-tenant relationship
        UserTenantModel::create([
            'user_id' => $user->id,
            'tenant_id' => $tenant->id,
            'status' => true,
        ]);

        //$this->command->info('Test TenantSeeder completed successfully!');
    }
}
