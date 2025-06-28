<?php

namespace App\Models\Tenant;

use App\Models\Manager\UserModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Helpers\TenantModelHelper;

class PresenceActivityModel extends TenantModelHelper
{
    use HasFactory;
    protected $connection = 'tenants';
    protected $table = 'presence_activities';
    protected $baseTable = 'presence_activities';
    protected $fillable = [
        'user_id',
        'check_in',
        'check_out',
        'time_worked',
    ];

    public $timestamps = true;

    public function user(): BelongsTo
    {
        return $this->belongsTo(UserModel::class, 'user_id')
            ->on('manager');
    }

}
