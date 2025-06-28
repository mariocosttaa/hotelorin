<?php

namespace App\Http\Requests\Panel;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Tenant\SettingModel;
use Illuminate\Validation\Rule;
use App\Models\Tenant\ComoditeModel;
use App\Models\Tenant\RoomTypeModel;
use App\Models\Tenant\RoomModel;
use App\Actions\General\EasyHashAction;
use App\Actions\General\MoneyAction;

/**
 * @property string $overview_name_pt
 * @property string $overview_name_en
 * @property string $overview_name_es
 * @property string $overview_name_fr
 * @property string $overview_description_pt
 * @property string $overview_description_en
 * @property string $overview_description_es
 * @property string $overview_description_fr
 * @property int $room_type_id
 * @property int $max_adults
 * @property int $max_children
 * @property int $max_infants
 * @property int $max_pets
 * @property array $comodites
 * @property mixed $gallery
 * @property mixed $gallery_imported
 * @property array $gallery_to_delete
 * @method array all()
 * @method mixed input(string $key = null, mixed $default = null)
 * @method void merge(array $data)
 */
class PanelRoomUpdateRequest extends FormRequest
{

    public SettingModel $setting;

    public function authorize()
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Decode the comodites if they exist (if you use hashed IDs)
        if ($this->input('comodites') && is_array($this->input('comodites'))) {
            $decodedComodites = array_map(function ($id) {
                return EasyHashAction::decode($id, 'comodite-id');
            }, $this->input('comodites'));
            $this->merge([
                'comodites' => $decodedComodites
            ]);
        }

        // Decode room_type_id if present
        if ($this->input('room_type_id')) {
            $decodedRoomTypeId = EasyHashAction::decode($this->input('room_type_id'), 'room-type-id');
            $this->merge([
                'room_type_id' => $decodedRoomTypeId
            ]);
        }

        // Decode gallery_to_delete if present
        if ($this->input('gallery_to_delete') && is_array($this->input('gallery_to_delete'))) {
            $decodedGalleryToDelete = array_map(function ($id) {
                return EasyHashAction::decode($id, 'room-gallery-id');
            }, $this->input('gallery_to_delete'));
            $this->merge([
                'gallery_to_delete' => $decodedGalleryToDelete
            ]);
        }

        // Serialize price values to integers using MoneyAction
        $currencies = ['USD', 'EUR', 'AOA', 'BRL'];
        foreach ($currencies as $currency) {
            $priceField = 'price_' . strtolower($currency);
            $ilustrativeField = $priceField . '_ilustrative';

            // Real price
            $priceValue = $this->input($priceField);
            if ($priceValue === '' || $priceValue === null) {
                $this->merge([$priceField => null]);
            } else {
                $serializedPrice = MoneyAction::sanitize($priceValue);
                $this->merge([$priceField => $serializedPrice]);
            }

            // Ilustrative price
            $ilustrativeValue = $this->input($ilustrativeField);
            if ($ilustrativeValue === '' || $ilustrativeValue === null) {
                $this->merge([$ilustrativeField => null]);
            } else {
                $serializedIlustrative = MoneyAction::sanitize($ilustrativeValue);
                $this->merge([$ilustrativeField => $serializedIlustrative]);
            }
        }
    }

    public function rules()
    {
        $this->setting = SettingModel::first();
        $defaultCurrency = $this->setting->default_currency_code;
        $priceFields = [
            'USD' => 'price_usd',
            'EUR' => 'price_eur',
            'AOA' => 'price_aoa',
            'BRL' => 'price_brl',
        ];

        // Check if room_type_id is provided
        $hasRoomType = $this->input('room_type_id') && !empty($this->input('room_type_id'));

        $rules = [
            'room_type_id' => ['nullable', Rule::exists(RoomTypeModel::class, 'id')],
            'max_adults' => 'required|integer|min:1',
            'max_children' => 'required|integer|min:0',
            'max_infants' => 'required|integer|min:0',
            'max_pets' => 'required|integer|min:0',
            'gallery' => 'nullable|array',
            'gallery.*' => 'nullable|file|mimes:jpg,jpeg,png,webp,gif,svg,mp4,mov,avi|max:5120',
            'gallery_imported' => 'nullable|array',
            'gallery_imported.*' => 'nullable|string',
            'gallery_to_delete' => 'nullable|array',
            'gallery_to_delete.*' => 'nullable|integer',
            'comodites' => 'nullable|array',
            'comodites.*' => Rule::exists(ComoditeModel::class, 'id'),
        ];

        // Add name/description validation based on whether room_type_id is provided
        if (!$hasRoomType) {
            // If no room_type_id, require name and description for default language
            $defaultLanguage = $this->setting->default_language;
            $rules["overview_name_{$defaultLanguage}"] = 'required|string|max:255';
            $rules["overview_description_{$defaultLanguage}"] = 'required|string|max:500';

            // Other languages are optional
            $languages = ['pt', 'en', 'es', 'fr'];
            foreach ($languages as $language) {
                if ($language !== $defaultLanguage) {
                    $rules["overview_name_{$language}"] = 'nullable|string|max:255';
                    $rules["overview_description_{$language}"] = 'nullable|string|max:500';
                }
            }
        } else {
            // If room_type_id is provided, name and description are optional (will inherit from room type)
            $languages = ['pt', 'en', 'es', 'fr'];
            foreach ($languages as $language) {
                $rules["overview_name_{$language}"] = 'nullable|string|max:255';
                $rules["overview_description_{$language}"] = 'nullable|string|max:500';
            }
        }

        foreach ($priceFields as $currency => $field) {
            $required = $currency === $defaultCurrency ? 'required' : 'nullable';
            $rules[$field] = [$required, 'integer', 'min:0'];
            $rules[$field.'_ilustrative'] = ['nullable', 'integer', 'min:0'];
            $rules[$field.'_status'] = ['required', 'boolean'];
        }
        return $rules;
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $defaultCurrency = $this->setting->default_currency_code;
            $field = 'price_' . strtolower($defaultCurrency);
            $value = $this->input($field);
            if ($value === null || $value === '' || !is_int($value) || $value < 0) {
                $validator->errors()->add($field, 'The price for the default currency ('.$defaultCurrency.') is required and must be a positive integer.');
            }
        });
    }
}
