<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Helpers\TenantModelHelper;

class RoomComoditeModel extends TenantModelHelper
{
    use HasFactory;
    protected $connection = 'tenants';
    protected $table = 'room_comodites';
    protected $baseTable = 'room_comodites';
    protected $fillable = [
        'comodite_id',
        'room_type_id',
        'room_id',
        'use_type_comodites_in_room',
    ];

    public $timestamps = true;

    protected $casts = [
        'use_type_comodites_in_room' => 'boolean',
    ];

    public function comodite(): BelongsTo
    {
        return $this->belongsTo(ComoditeModel::class, 'comodite_id');
    }

    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomTypeModel::class, 'room_type_id');
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(RoomModel::class, 'room_id');
    }
}
