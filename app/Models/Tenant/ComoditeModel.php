<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Helpers\TenantModelHelper;

class ComoditeModel extends TenantModelHelper
{
    use HasFactory;
    protected $connection = 'tenants';
    protected $table = 'comodites';
    protected $baseTable = 'comodites';
    protected $fillable = [
        'icon',
        'name_pt',
        'name_en',
        'name_es',
        'name_fr',
        'description_pt',
        'description_en',
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
        return $this->{"description_$lang"} ??  $this->description_en ?? $this->description_pt ?? $this->description_es ?? $this->description_fr;
    }

}
