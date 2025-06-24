<?php

namespace App\Models\Tenant;

use App\Models\Manager\CurrencyModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Helpers\TenantModelHelper;

class RoomPriceModel extends TenantModelHelper
{
    use HasFactory;
    protected $connection = 'tenants';
    protected $table = 'room_prices';
    protected $baseTable = 'room_prices';
    protected $fillable = [
        'price',
        'price_ilustrative',
        'currency_code',
        'status',
    ];

    public $timestamps = true;

    public function currency(): BelongsTo
    {
        return $this->belongsTo(CurrencyModel::class, 'currency_code', 'code');
    }

}
