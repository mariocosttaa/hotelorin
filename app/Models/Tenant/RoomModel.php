<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Helpers\TenantModelHelper;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Log;
use App\Models\Tenant\RoomComoditeModel;
use App\Models\Tenant\RoomGalleryModel;
use App\Models\Tenant\RoomPriceModel;
use App\Models\Tenant\RoomTypeModel;

class RoomModel extends TenantModelHelper
{
    use HasFactory;
    protected $connection = 'tenants';
    protected $table = 'rooms';
    protected $baseTable = 'rooms';
    protected $fillable = [

        //OverWrite
        'overview_name_pt',
        'overview_name_en',
        'overview_name_es',
        'overview_name_fr',
        //OverWrite
        'overview_description_pt',
        'overview_description_en',
        'overview_description_es',
        'overview_description_fr',
        //OverWrite
        'overview_slug_pt',
        'overview_slug_en',
        'overview_slug_es',
        'overview_slug_fr',
        //Room
        'room_type_id',
        //Max Capacity
        'max_adults',
        'max_children',
        'max_infants',
        'max_pets',
    ];

    public $timestamps = true;

    public function getOverviewNameAttribute(): ?string
    {
        $lang = app()->getLocale();
        return $this->{"overview_name_$lang"} ?? $this->overview_name_en ?? $this->overview_name_pt ?? $this->overview_name_es ?? $this->overview_name_fr;
    }

    public function getOverviewDescriptionAttribute(): ?string
    {
        $lang = app()->getLocale();
        return $this->{"overview_description_$lang"} ?? $this->overview_description_en ?? $this->overview_description_pt ?? $this->overview_description_es ?? $this->overview_description_fr;
    }

    public function getOverviewSlugAttribute(): ?string
    {
        $lang = app()->getLocale();
        return $this->{"overview_slug_$lang"} ?? $this->overview_slug_en ?? $this->overview_slug_pt ?? $this->overview_slug_es ?? $this->overview_slug_fr;
    }

    public function getNameAttribute(): ?string
    {
        $lang = app()->getLocale();
        $overviewNameField = "overview_name_$lang";
        $fallbackLanguages = ['en', 'pt', 'es', 'fr'];

        // First, check if room has its own name
        if (isset($this->$overviewNameField) && !empty($this->$overviewNameField)) {
            return $this->$overviewNameField;
        }

        // Fallback to other languages for room-specific names
        foreach ($fallbackLanguages as $fallbackLang) {
            $fallbackField = "overview_name_$fallbackLang";
            if (isset($this->$fallbackField) && !empty($this->$fallbackField)) {
                return $this->$fallbackField;
            }
        }

        // If no room-specific name, inherit from room type
        if (!$this->roomType) {
            return null;
        }

        $nameField = "name_$lang";

        // Try to get name from room type based on current locale
        if (isset($this->roomType->$nameField) && !empty($this->roomType->$nameField)) {
            return $this->roomType->$nameField;
        }

        // Fallback to other languages in order of preference
        foreach ($fallbackLanguages as $fallbackLang) {
            $fallbackField = "name_$fallbackLang";
            if (isset($this->roomType->$fallbackField) && !empty($this->roomType->$fallbackField)) {
                return $this->roomType->$fallbackField;
            }
        }

        return null;
    }

    public function getDescriptionAttribute(): ?string
    {
        $lang = app()->getLocale();
        $overviewDescField = "overview_description_$lang";
        $fallbackLanguages = ['en', 'pt', 'es', 'fr'];

        // First, check if room has its own description
        if (isset($this->$overviewDescField) && !empty($this->$overviewDescField)) {
            return $this->$overviewDescField;
        }

        // Fallback to other languages for room-specific descriptions
        foreach ($fallbackLanguages as $fallbackLang) {
            $fallbackField = "overview_description_$fallbackLang";
            if (isset($this->$fallbackField) && !empty($this->$fallbackField)) {
                return $this->$fallbackField;
            }
        }

        // If no room-specific description, inherit from room type
        if (!$this->roomType) {
            return null;
        }

        $descField = "description_$lang";

        // Try to get description from room type based on current locale
        if (isset($this->roomType->$descField) && !empty($this->roomType->$descField)) {
            return $this->roomType->$descField;
        }

        // Fallback to other languages in order of preference
        foreach ($fallbackLanguages as $fallbackLang) {
            $fallbackField = "description_$fallbackLang";
            if (isset($this->roomType->$fallbackField) && !empty($this->roomType->$fallbackField)) {
                return $this->roomType->$fallbackField;
            }
        }

        return null;
    }

    public function comodites(): HasMany
    {
        return $this->hasMany(RoomComoditeModel::class, 'room_id');
    }

    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomTypeModel::class, 'room_type_id');
    }

    /**
     * Galerias específicas do quarto (não herdadas)
     */
    public function galleries(): HasMany
    {
        return $this->hasMany(RoomGalleryModel::class, 'room_id');
    }

    /**
     * Preços específicos do quarto (não herdados)
     */
    public function prices(): HasMany
    {
        return $this->hasMany(RoomPriceModel::class, 'room_id');
    }

    /**
     * Galeria completa (própria + do tipo se use_type_gallery_in_room = true)
     */
    public function getFullGallery()
    {
        return RoomGalleryModel::where(function($query) {
            $query->where('room_id', $this->id)
                  ->orWhere(function($q) {
                      $q->where('room_type_id', $this->room_type_id)
                        ->where('use_type_gallery_in_room', true);
                  });
        })->get();
    }

    /**
     * Comodidades completas (próprias + do tipo se use_type_comodites_in_room = true)
     */
    public function getFullComodites()
    {
        return RoomComoditeModel::where(function($query) {
            $query->where('room_id', $this->id)
                  ->orWhere(function($q) {
                      $q->where('room_type_id', $this->room_type_id)
                        ->where('use_type_comodites_in_room', true);
                  });
        })->with('comodite')->get();
    }

    /**
     * Preços completos (próprios + do tipo se use_type_price_in_room = true)
     * Prioriza preços próprios sobre herdados
     */
    public function getFullPrices()
    {
        // Get own prices first
        $ownPrices = RoomPriceModel::where('room_id', $this->id)
            ->with('currency')
            ->get()
            ->keyBy('currency_code');

        // Get inherited prices from room type
        $inheritedPrices = RoomPriceModel::where('room_type_id', $this->room_type_id)
            ->where('use_type_price_in_room', true)
            ->with('currency')
            ->get()
            ->keyBy('currency_code');

        // Start with own prices
        $finalPrices = $ownPrices;

        // Add inherited prices only if no own price exists for that currency
        foreach ($inheritedPrices as $currencyCode => $inheritedPrice) {
            if (!$finalPrices->has($currencyCode)) {
                $finalPrices->put($currencyCode, $inheritedPrice);
            }
        }

        return $finalPrices->values();
    }

    /**
     * Galerias do tipo de quarto (que podem ser herdadas)
     */
    public function getTypeGalleries()
    {
        return RoomGalleryModel::where('room_type_id', $this->room_type_id)
            ->where('use_type_gallery_in_room', true)
            ->get();
    }

    /**
     * Comodidades do tipo de quarto (que podem ser herdadas)
     */
    public function getTypeComodites()
    {
        return RoomComoditeModel::where('room_type_id', $this->room_type_id)
            ->where('use_type_comodites_in_room', true)
            ->with('comodite')
            ->get();
    }

    /**
     * Preços do tipo de quarto (que podem ser herdados)
     */
    public function getTypePrices()
    {
        return RoomPriceModel::where('room_type_id', $this->room_type_id)
            ->where('use_type_price_in_room', true)
            ->with('currency')
            ->get();
    }

}
