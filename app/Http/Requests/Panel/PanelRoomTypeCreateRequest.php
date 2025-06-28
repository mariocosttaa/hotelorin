<?php

namespace App\Http\Requests\Panel;

use App\Actions\General\EasyHashAction;
use App\Actions\General\MoneyAction;
use App\Models\Tenant\ComoditeModel;
use App\Models\Tenant\RoomTypeModel;
use App\Models\Tenant\SettingModel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property string $name_pt
 * @property string $name_en
 * @property string $name_es
 * @property string $name_fr
 * @property string $description_pt
 * @property string $description_en
 * @property string $description_es
 * @property string $description_fr
 * @property array $comodites
 * @property mixed $gallery
 * @property string $price_usd
 * @property string $price_usd_ilustrative
 * @property boolean $price_usd_status
 * @property string $price_eur
 * @property string $price_eur_ilustrative
 * @property boolean $price_eur_status
 * @property string $price_aoa
 * @property string $price_aoa_ilustrative
 * @property boolean $price_aoa_status
 * @property string $price_brl
 * @property string $price_brl_ilustrative
 * @property boolean $price_brl_status
 * @method mixed input(string $key = null, mixed $default = null)
 * @method void merge(array $data)
 */
class PanelRoomTypeCreateRequest extends FormRequest
{
    public SettingModel $setting;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Decode the comodites if they exist
        if ($this->input('comodites') && is_array($this->input('comodites'))) {
            $decodedComodites = array_map(function ($id) {
                return EasyHashAction::decode($id, 'comodite-id');
            }, $this->input('comodites'));

            $this->merge([
                'comodites' => $decodedComodites
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

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
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
            'gallery' => 'nullable|array|max:10',
            'gallery.*' => 'file|mimes:jpeg,png,jpg,gif,svg,mp4,avi,mov,wmv,flv,webm|max:5120',
            'comodites' => 'nullable|array|max:10',
            'comodites.*' => Rule::exists(ComoditeModel::class, 'id'),
        ];

        // Add price validation rules
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

    private function getRequiredInputByLanguage(): array
    {
        $defaultLanguage = SettingModel::first()->default_language;
        $languages = ['pt', 'en', 'es', 'fr'];
        $requiredInput = [];

        foreach ($languages as $language) {
            // If the language is the default language, it is required
            if ($language === $defaultLanguage) {
                $requiredInput["name_{$language}"] = [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique(RoomTypeModel::class, 'name_'.$language)
                ];
                $requiredInput["description_{$language}"] = 'required|string|max:255';
            } else {
                // If the language is not the default language, it is optional
                $requiredInput["name_{$language}"] = [
                    'nullable',
                    'string',
                    'max:255',
                    Rule::unique(RoomTypeModel::class, 'name_'.$language)
                ];
                $requiredInput["description_{$language}"] = 'nullable|string|max:255';
            }
        }

        return $requiredInput;
    }
}
