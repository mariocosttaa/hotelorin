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
        $users = UserModel::all();
        $subscriptions = SubscriptionModel::all();
        $subscriptionPrices = SubscriptionPriceModel::all();

        if ($users->isEmpty() || $subscriptions->isEmpty() || $subscriptionPrices->isEmpty()) {
            $this->command->warn('Skipping TenantSeeder: Missing required data (users, subscriptions, or subscription prices)');
            return;
        }

        // Fake tenant data
        $fakeTenants = [
            [
                'name' => 'Acme Corporation',
                'slug' => 'acme-corp',
                'subscription_id' => $subscriptions->random()->id,
                'subscription_price_id' => $subscriptionPrices->random()->id,
                'payment_date' => Carbon::now()->subDays(rand(1, 30)),
                'expiration_date' => Carbon::now()->addMonths(rand(1, 12)),
                'owner_user_id' => $users->random()->id,
                'status' => true,
            ],
            [
                'name' => 'TechStart Solutions',
                'slug' => 'techstart-solutions',
                'subscription_id' => $subscriptions->random()->id,
                'subscription_price_id' => $subscriptionPrices->random()->id,
                'payment_date' => Carbon::now()->subDays(rand(1, 30)),
                'expiration_date' => Carbon::now()->addMonths(rand(1, 12)),
                'owner_user_id' => $users->random()->id,
                'status' => true,
            ],
            [
                'name' => 'Global Innovations Ltd',
                'slug' => 'global-innovations',
                'subscription_id' => $subscriptions->random()->id,
                'subscription_price_id' => $subscriptionPrices->random()->id,
                'payment_date' => Carbon::now()->subDays(rand(1, 30)),
                'expiration_date' => Carbon::now()->addMonths(rand(1, 12)),
                'owner_user_id' => $users->random()->id,
                'status' => true,
            ],
            [
                'name' => 'Digital Dynamics',
                'slug' => 'digital-dynamics',
                'subscription_id' => $subscriptions->random()->id,
                'subscription_price_id' => $subscriptionPrices->random()->id,
                'payment_date' => Carbon::now()->subDays(rand(1, 30)),
                'expiration_date' => Carbon::now()->addMonths(rand(1, 12)),
                'owner_user_id' => $users->random()->id,
                'status' => false, // Inactive tenant
            ],
            [
                'name' => 'Future Systems Inc',
                'slug' => 'future-systems',
                'subscription_id' => $subscriptions->random()->id,
                'subscription_price_id' => $subscriptionPrices->random()->id,
                'payment_date' => Carbon::now()->subDays(rand(1, 30)),
                'expiration_date' => Carbon::now()->addMonths(rand(1, 12)),
                'owner_user_id' => $users->random()->id,
                'status' => true,
            ],
            [
                'name' => 'Cloud Computing Pro',
                'slug' => 'cloud-computing-pro',
                'subscription_id' => $subscriptions->random()->id,
                'subscription_price_id' => $subscriptionPrices->random()->id,
                'payment_date' => Carbon::now()->subDays(rand(1, 30)),
                'expiration_date' => Carbon::now()->addMonths(rand(1, 12)),
                'owner_user_id' => $users->random()->id,
                'status' => true,
            ],
            [
                'name' => 'Smart Solutions Group',
                'slug' => 'smart-solutions-group',
                'subscription_id' => $subscriptions->random()->id,
                'subscription_price_id' => $subscriptionPrices->random()->id,
                'payment_date' => Carbon::now()->subDays(rand(1, 30)),
                'expiration_date' => Carbon::now()->addMonths(rand(1, 12)),
                'owner_user_id' => $users->random()->id,
                'status' => true,
            ],
            [
                'name' => 'Innovation Hub',
                'slug' => 'innovation-hub',
                'subscription_id' => $subscriptions->random()->id,
                'subscription_price_id' => $subscriptionPrices->random()->id,
                'payment_date' => Carbon::now()->subDays(rand(1, 30)),
                'expiration_date' => Carbon::now()->addMonths(rand(1, 12)),
                'owner_user_id' => $users->random()->id,
                'status' => true,
            ],
            [
                'name' => 'Data Analytics Corp',
                'slug' => 'data-analytics-corp',
                'subscription_id' => $subscriptions->random()->id,
                'subscription_price_id' => $subscriptionPrices->random()->id,
                'payment_date' => Carbon::now()->subDays(rand(1, 30)),
                'expiration_date' => Carbon::now()->addMonths(rand(1, 12)),
                'owner_user_id' => $users->random()->id,
                'status' => true,
            ],
            [
                'name' => 'Web Development Studio',
                'slug' => 'web-dev-studio',
                'subscription_id' => $subscriptions->random()->id,
                'subscription_price_id' => $subscriptionPrices->random()->id,
                'payment_date' => Carbon::now()->subDays(rand(1, 30)),
                'expiration_date' => Carbon::now()->addMonths(rand(1, 12)),
                'owner_user_id' => $users->random()->id,
                'status' => true,
            ],
        ];

        foreach ($fakeTenants as $tenantData) {
            // Check if tenant already exists
            if (TenantModel::where('slug', $tenantData['slug'])->exists()) {
                continue;
            }

            // Create tenant
            $tenant = TenantModel::create($tenantData);

            // Create user-tenant relationship
            UserTenantModel::create([
                'user_id' => $tenantData['owner_user_id'],
                'tenant_id' => $tenant->id,
                'status' => true,
            ]);

            // Optionally assign additional users to some tenants
            if (rand(1, 3) === 1) {
                $additionalUsers = $users->where('id', '!=', $tenantData['owner_user_id'])->random(rand(1, 3));
                foreach ($additionalUsers as $user) {
                    UserTenantModel::create([
                        'user_id' => $user->id,
                        'tenant_id' => $tenant->id,
                        'status' => true,
                    ]);
                }
            }
        }

        $this->command->info('TenantSeeder completed successfully!');
    }
}
