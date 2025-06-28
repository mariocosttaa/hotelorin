<?php

namespace App\Models\Tenant;

use App\Models\Manager\CurrencyModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Helpers\TenantModelHelper;
use App\Actions\General\MoneyAction;

class RoomPriceModel extends TenantModelHelper
{
    use HasFactory;
    protected $connection = 'tenants';
    protected $table = 'room_prices';
    protected $baseTable = 'room_prices';
    protected $fillable = [
        'room_id',
        'room_type_id',
        'use_type_price_in_room',
        'price',
        'price_ilustrative',
        'currency_code',
        'status',
    ];

    public $timestamps = true;

    protected $casts = [
        'use_type_price_in_room' => 'boolean',
    ];

    public function getPriceFormattedAttribute(): string
    {
        return MoneyAction::format($this->price, null, $this->currency_code, true) ?? '0';
    }

    public function getPriceIlustrativeFormattedAttribute(): ?string
    {
        if (!$this->price_ilustrative) {
            return null;
        }
        return MoneyAction::format($this->price_ilustrative, null, $this->currency_code, true);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(RoomModel::class, 'room_id', 'id');
    }

    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomTypeModel::class, 'room_type_id', 'id');
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(CurrencyModel::class, 'currency_code', 'code');
    }

}
