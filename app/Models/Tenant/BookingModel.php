<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Helpers\TenantModelHelper;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BookingModel extends TenantModelHelper
{
    use HasFactory;
    protected $connection = 'tenants';
    protected $table = 'bookings';
    protected $baseTable = 'bookings';
    protected $fillable = [
        'room_id',
        'check_in',
        'check_out',
        'status',
    ];

    public $timestamps = true;

    public function room(): BelongsTo
    {
        return $this->belongsTo(RoomModel::class, 'room_id');
    }

    public function people(): HasMany
    {
        return $this->hasMany(BookingPeopleModel::class, 'booking_id');
    }

}
