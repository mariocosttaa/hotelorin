<?php

namespace App\Models\Tenant;

use App\Actions\General\MoneyAction;
use App\Models\Manager\CurrencyModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Helpers\TenantModelHelper;

class BookingPaymentModel extends TenantModelHelper
{
    use HasFactory;
    protected $connection = 'tenants';
    protected $table = 'bookings';
    protected $baseTable = 'bookings';
    protected $fillable = [
        'invoice_id',
        'amount',
        'currency_code',
        'status',
    ];

    protected $casts = [
        'status' => 'string', //pending, processing, paid, cancelled, expired
    ];

    public $timestamps = true;

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(BookingInvoiceModel::class, 'invoice_id');
    }

    protected function getAmountFormattedAttribute(): string
    {
        return MoneyAction::format(
            amount: $this->amount,
            decimalPlaces: $this->currency->decimal_separator,
            currency: $this->currency->code,
            formatWithSymbol: true,
        );
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(CurrencyModel::class, 'currency_code', 'code')
            ->on('manager');
    }

}
