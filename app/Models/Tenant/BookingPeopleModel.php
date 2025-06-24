<?php

namespace App\Models\Tenant;

use App\Models\Manager\UserModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Helpers\TenantModelHelper;

class BookingPeopleModel extends TenantModelHelper
{
    use HasFactory;
    protected $connection = 'tenants';
    protected $table = 'booking_people';
    protected $baseTable = 'booking_people';
    protected $fillable = [
        'client_id',
        'booking_id',
        //Person
        'type',
        'name',
        'surname',
        'email',
        'phone_code',
        'phone',
        //Document
        'document',
        'document_type',
        'document_country_code',
    ];

    public $timestamps = true;

    public function client(): BelongsTo
    {
        return $this->belongsTo(ClientModel::class, 'client_id');
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(BookingModel::class, 'booking_id');
    }

}
