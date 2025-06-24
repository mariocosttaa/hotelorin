<?php

namespace App\Models\Manager;

use App\Models\Tenant\SectorModel;
use Illuminate\Database\Eloquent\Model;

class UserSectorModel extends Model
{
    protected $connection = 'manager';
    protected $table = 'user_sector';

    protected $fillable = [
        'user_id',
        'sector_id',
        'tenant_id',
    ];

    public function sector()
    {
        return $this->belongsTo(SectorModel::class, 'sector_id');
    }

    public function tenant()
    {
        return $this->belongsTo(TenantModel::class, 'tenant_id');
    }
}
