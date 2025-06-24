<?php

namespace App\Models\Manager;

use App\Models\Helpers\ManagerModelHelper;
use App\Models\Tenant\RankModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserRankModel extends ManagerModelHelper
{
    use HasFactory;
    protected $connection = 'manager';
    protected $table = 'user_rank';

    protected $fillable = [
        'user_id',
        'rank_id',
        'tenant_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(UserModel::class, 'user_id');
    }

    // In UserRankModel
    public function rank(): BelongsTo
    {
        return $this->belongsTo(RankModel::class, 'rank_id');
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(TenantModel::class, 'tenant_id');
    }

}
