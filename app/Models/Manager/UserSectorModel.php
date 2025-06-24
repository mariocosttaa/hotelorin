<?php

namespace App\Models\Manager;

use App\Models\Helpers\ManagerModelHelper;
use App\Models\Tenant\SectorModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSectorModel extends ManagerModelHelper
{
    use HasFactory;

    protected $table = 'user_sectors';

    protected $fillable = [
        'user_id',
        'sector_id',
        'tenant_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(UserModel::class, 'user_id');
    }

    public function sector(): BelongsTo
    {
        return $this->belongsTo(SectorModel::class, 'sector_id');
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(TenantModel::class, 'tenant_id');
    }


}
