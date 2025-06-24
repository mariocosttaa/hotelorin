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
        switch ($lang) {
            case 'en':
                return $this->name_en ?? $this->name_pt ?? $this->name_es ?? $this->name_fr;
            case 'es':
                return $this->name_es ?? $this->name_pt ?? $this->name_en ?? $this->name_fr;
            case 'fr':
                return $this->name_fr ?? $this->name_pt ?? $this->name_en ?? $this->name_es;
            case 'pt':
            default:
                return $this->name_pt ?? $this->name_en ?? $this->name_es ?? $this->name_fr;
        }
    }

    public function getDescriptionAttribute(): string
    {
        $lang = app()->getLocale();
        switch ($lang) {
            case 'en':
                return $this->description_en ?? $this->description_pt ?? $this->description_es ?? $this->description_fr;
            case 'es':
                return $this->description_es ?? $this->description_pt ?? $this->description_en ?? $this->description_fr;
            case 'fr':
                return $this->description_fr ?? $this->description_pt ?? $this->description_en ?? $this->description_es;
            case 'pt':
            default:
                return $this->description_pt ?? $this->description_en ?? $this->description_es ?? $this->description_fr;
        }
    }

}
