<?php

namespace App\Http\Requests\Panel;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Tenant\SettingModel;
use Illuminate\Validation\Rule;
use App\Models\Tenant\ComoditeModel;
use App\Models\Tenant\RoomTypeModel;
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
 * @method mixed input(string $key = null, mixed $default = null)
 * @method void merge(array $data)
 */
class PanelRoomCreateRequest extends FormRequest
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

        // Serialize price values to integers using MoneyAction
        $currencies = ['USD', 'EUR', 'AOA', 'BRL'];
        foreach ($currencies as $currency) {
            $priceField = 'price_' . strtolower($currency);
            $ilustrativeField = $priceField . '_ilustrative';

            // Serialize real price
            if ($this->input($priceField) !== null && $this->input($priceField) !== '') {
                $serializedPrice = MoneyAction::sanitize($this->input($priceField));
                $this->merge([$priceField => $serializedPrice]);
            }

            // Serialize illustrative price
            if ($this->input($ilustrativeField) !== null && $this->input($ilustrativeField) !== '') {
                $serializedIlustrative = MoneyAction::sanitize($this->input($ilustrativeField));
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
        $rules = [
            ...$this->getRequiredInputByLanguage(),
            'room_type_id' => ['nullable', Rule::exists(RoomTypeModel::class, 'id'), 'required_without:overview_name_' . $this->setting->default_language],
            'max_adults' => 'required|integer|min:1',
            'max_children' => 'required|integer|min:0',
            'max_infants' => 'required|integer|min:0',
            'max_pets' => 'required|integer|min:0',
            'gallery' => 'nullable|array',
            'gallery.*' => 'nullable|file|mimes:jpg,jpeg,png,webp,gif,svg,mp4,mov,avi|max:5120',
            'gallery_imported' => 'nullable|array',
            'gallery_imported.*' => 'nullable|string',
            'comodites' => 'nullable|array',
            'comodites.*' => Rule::exists(ComoditeModel::class, 'id'),
        ];
        foreach ($priceFields as $currency => $field) {
            $required = $currency === $defaultCurrency ? 'required' : 'nullable';
            $rules[$field] = [$required, 'integer', 'min:0'];
            $rules[$field.'_ilustrative'] = ['nullable', 'integer', 'min:0'];
            $rules[$field.'_status'] = ['required', 'boolean'];
        }
        return $rules;
    }

    private function getRequiredInputByLanguage(): array
    {
        $defaultLanguage = $this->setting->default_language;
        $languages = ['pt', 'en', 'es', 'fr'];
        $requiredInput = [];

        foreach ($languages as $language) {
            if ($language === $defaultLanguage) {
                $requiredInput["overview_name_{$language}"] = 'required|string|max:255';
                $requiredInput["overview_description_{$language}"] = 'required|string|max:500';
            } else {
                $requiredInput["overview_name_{$language}"] = 'nullable|string|max:255';
                $requiredInput["overview_description_{$language}"] = 'nullable|string|max:500';
            }
        }
        return $requiredInput;
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
