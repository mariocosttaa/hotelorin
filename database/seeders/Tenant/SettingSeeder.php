<?php

namespace Database\Seeders\Tenant;

use App\Models\Tenant\SettingModel;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
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

        // Check if settings already exist for this tenant
        $existingSettings = SettingModel::first();

        if ($existingSettings) {
            // Settings already exist, skip creation
            return;
        }

        // Create default settings
        SettingModel::create([
            // Logos and Icons - Default to null (will use system defaults)
            'logo_light' => 'https://via.placeholder.com/150',
            'logo_dark' => 'https://via.placeholder.com/150',
            'favicon' => 'https://via.placeholder.com/150',

            // Contact and Social - Default empty values
            'email' => 'test@test.com',
            'address' => 'Rua Teste, 123, Lisboa, Portugal',
            'phone_code' => '+351', // Default to Brazil
            'phone' => '912345678',
            'whatsapp_number_code' => '+351', // Default to Brazil
            'whatsapp_number' => '912345678',
            'facebook' => 'https://www.facebook.com/test',
            'instagram' => 'https://www.instagram.com/test',

            // Customization - Default values
            'template' => 'default', // Default template
            'theme_color' => '#3B82F6', // Default blue color

            // Language - Default to Portuguese
            'multi_language' => true, // Enable multi-language by default
            'default_language' => 'pt', // Portuguese as default

            // Currency - Default to Brazilian Real
            'multi_currency' => true, // Enable multi-currency by default
            'default_currency_code' => 'eur', // Brazilian Real as default

            // Bookings - Default settings
            'online_booking' => true, // Enable online booking
            'online_booking_payment' => true, // Enable payment for bookings
            'online_booking_require_payment' => false, // Don't require payment immediately
            'online_booking_auto_confirm' => true, // Don't auto-confirm bookings

            // Check-in and Check-out - Default times
            'default_check_in' => '14:00', // 2:00 PM
            'default_check_out' => '12:00', // 12:00 PM

            // Modules - Default settings
            'module_presence_activities' => false, // Disable by default
        ]);
    }
}
