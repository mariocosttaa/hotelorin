<?php

namespace App\Models\Tenant;

use App\Models\Manager\CurrencyModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Helpers\TenantModelHelper;

class SettingModel extends TenantModelHelper
{
    use HasFactory;

    protected $connection = 'tenants';
    protected $table = 'settings';
    protected $baseTable = 'settings';
    protected $fillable = [
        // logos and Icons
        'logo_light',
        'logo_dark',
        'favicon',

        // Contact and Social
        'email',
        'address',
        'phone_code',
        'phone',
        'whatsapp_number_code',
        'whatsapp_number',
        'facebook',
        'instagram',

        // customization
        'template',
        'theme_color',

        // language
        'multi_language',
        'default_language',

        // currency
        'multi_currency',
        'default_currency_code',

        // bookings
        'online_booking',
        'online_booking_payment',
        'online_booking_require_payment',
        'online_booking_auto_confirm',

        // checkIn and checkOut
        'default_check_in',
        'default_check_out',

        // Modules
        'module_presence_activities',
    ];

    protected $casts = [
        'default_language' => 'string', // enum: ['pt', 'en', 'es', 'fr']
        'multi_currency' => 'boolean',
        'multi_language' => 'boolean',
        'online_booking' => 'boolean',
        'online_booking_payment' => 'boolean',
        'online_booking_require_payment' => 'boolean',
        'online_booking_auto_confirm' => 'boolean',
        'module_presence_activities' => 'boolean',
    ];

    public $timestamps = true;

    public function phone_number(): string
    {
        return $this->phone_code . $this->phone;
    }

    public function defaultCurrency(): BelongsTo
    {
        return $this->belongsTo(CurrencyModel::class, 'default_currency_code', 'code');
    }
}
