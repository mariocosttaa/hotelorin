<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Helpers\TenantModelHelper;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoomGalleryModel extends TenantModelHelper
{
    use HasFactory;
    protected $connection = 'tenants';
    protected $table = 'room_galleries';
    protected $baseTable = 'room_galleries';
    protected $fillable = [
        'room_type_id',
        'room_id',
        'use_type_gallery_in_room',
        'type',
        'src',
    ];

    protected $casts = [
        'use_type_gallery_in_room' => 'boolean',
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(RoomModel::class, 'room_id');
    }

    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomTypeModel::class, 'room_type_id');
    }

    public $timestamps = true;

}
