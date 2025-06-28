<?php

namespace App\Models\Tenant;

use App\Actions\General\MoneyAction;
use App\Models\Manager\CurrencyModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Helpers\TenantModelHelper;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BookingInvoiceModel extends TenantModelHelper
{
    use HasFactory;
    protected $connection = 'tenants';
    protected $table = 'booking_invoices';
    protected $baseTable = 'booking_invoices';
    protected $fillable = [
        'booking_id',
        'client_id',
        'amount',
        'currency_code',
        'attachment_id_pending',
        'attachment_id_paid',
        'status',
    ];

    protected $casts = [
        'status' => 'string', //pending, paid, cancelled, expired
    ];

    public $timestamps = true;


    public function booking(): BelongsTo
    {
        return $this->belongsTo(BookingModel::class, 'booking_id');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(ClientModel::class, 'client_id');
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(CurrencyModel::class, 'currency_code', 'code')
            ->on('manager');
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

    public function attachment_pending(): BelongsTo
    {
        return $this->belongsTo(AttachmentModel::class, 'attachment_id_pending');
    }

    public function attachment_paid(): BelongsTo
    {
        return $this->belongsTo(AttachmentModel::class, 'attachment_id_paid');
    }

}
