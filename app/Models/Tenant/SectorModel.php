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

    public function getNameAttribute(): string
    {
        $lang = app()->getLocale();
        return $this->{"name_$lang"} ?? $this->name_en ?? $this->name_pt ?? $this->name_es ?? $this->name_fr;
    }

    public function getDescriptionAttribute(): string
    {
        $lang = app()->getLocale();
        return $this->{"description_$lang"} ?? $this->description_en ?? $this->description_pt ?? $this->description_es ?? $this->description_fr;
    }

}
