<?php

namespace App\Models\Tenant;

use App\Models\Manager\CurrencyModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Helpers\TenantModelHelper;

class SectorModel extends TenantModelHelper
{
    use HasFactory;
    protected $connection = 'tenants';
    protected $table = 'sectors';
    protected $baseTable = 'sectors';
    protected $fillable = [
        'name_en',
        'name_pt',
        'name_es',
        'name_fr',
        'description_en',
        'description_pt',
        'description_es',
        'description_fr',
    ];

    public $timestamps = true;

}
