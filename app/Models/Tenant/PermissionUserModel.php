<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Helpers\TenantModelHelper;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PermissionUserModel extends TenantModelHelper
{
    use HasFactory;
    protected $connection = 'tenants';
    protected $table = 'permissions_user';
    protected $baseTable = 'permissions_user';
    protected $fillable = [
        'permission_id',
        'user_id',
        'access'
    ];

    protected $casts = [
        'access' => 'boolean',
    ];

    public $timestamps = true;

    public function permission(): BelongsTo
    {
        return $this->belongsTo(PermissionModel::class, 'permission_id');
    }

}
