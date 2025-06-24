<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Helpers\TenantModelHelper;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PermissionModel extends TenantModelHelper
{
    use HasFactory;
    protected $connection = 'tenants';
    protected $table = 'permissions';
    protected $baseTable = 'permissions';
    protected $fillable = [
        'page',
        'page_link',
        'minimum_rank_level',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    public $timestamps = true;

    public function users_permissions(): HasMany {
        return $this->hasMany(PermissionUserModel::class, 'permission_id');
    }

}
