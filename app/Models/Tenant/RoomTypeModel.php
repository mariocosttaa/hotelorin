<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Helpers\TenantModelHelper;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RoomTypeModel extends TenantModelHelper
{
    use HasFactory;
    protected $connection = 'tenants';
    protected $table = 'room_types';
    protected $baseTable = 'room_types';

    protected $fillable = [
        'name_pt',
        'name_en',
        'name_es',
        'name_fr',
        'description_pt',
        'description_en',
        'description_es',
        'description_fr',
        'slug_pt',
        'slug_en',
        'slug_es',
        'slug_fr',
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

    public function getSlugAttribute(): string
    {
        $lang = app()->getLocale();
        return $this->{"slug_$lang"} ?? $this->slug_en ?? $this->slug_pt ?? $this->slug_es ?? $this->slug_fr;
    }

    public function galleries(): HasMany
    {
        return $this->hasMany(RoomGalleryModel::class, 'room_type_id');
    }

    public function comodites(): HasMany
    {
        return $this->hasMany(RoomComoditeModel::class, 'room_type_id');
    }

}
