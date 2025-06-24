<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Helpers\TenantModelHelper;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RankModel extends TenantModelHelper
{
    use HasFactory;
    protected $connection = 'tenants';
    protected $table = 'ranks';
    protected $baseTable = 'ranks';
    protected $fillable = [
        'name_en',
        'name_pt',
        'name_es',
        'name_fr',
        'description_en',
        'description_pt',
        'description_es',
        'description_fr',
        'level',
    ];

    protected $casts = [
        'level' => 'integer', //1, 2, 3, 4, 5
    ];

    public $timestamps = true;

}
