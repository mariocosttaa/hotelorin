<?php

namespace App\Http\Requests\Panel;

use App\Actions\General\EasyHashAction;
use App\Models\Tenant\ComoditeModel;
use App\Models\Tenant\RoomTypeModel;
use App\Models\Tenant\SettingModel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
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
 * @method mixed input(string $key = null, mixed $default = null)
 * @method void merge(array $data)
 * @method mixed route(string $key = null)
 */
class PanelRoomTypeUpdateRequest extends FormRequest
{
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
        // Debug: Log all input data to see what's being received
        Log::info('Room Type Update Request Data:', [
            'name_pt' => $this->input('name_pt'),
            'description_pt' => $this->input('description_pt'),
            'gallery_input' => $this->input('gallery'),
        ]);

        // Decode the comodites if they exist
        if ($this->input('comodites') && is_array($this->input('comodites'))) {
            $decodedComodites = array_map(function ($id) {
                return EasyHashAction::decode($id, 'comodite-id');
            }, $this->input('comodites'));

            $this->merge([
                'comodites' => $decodedComodites
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name_pt' => 'nullable|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'name_es' => 'nullable|string|max:255',
            'name_fr' => 'nullable|string|max:255',
            'description_pt' => 'nullable|string|max:255',
            'description_en' => 'nullable|string|max:255',
            'description_es' => 'nullable|string|max:255',
            'description_fr' => 'nullable|string|max:255',
            'gallery' => 'nullable|array|max:10',
            'gallery.*' => 'file|mimes:jpeg,png,jpg,gif,svg,mp4,avi,mov,wmv,flv,webm|max:5120',
            'comodites' => 'nullable|array|max:10',
            'comodites.*' => Rule::exists(ComoditeModel::class, 'id'),
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Get the default language
            $defaultLanguage = SettingModel::first()->default_language;

            // Check if the required fields for the default language are present
            $nameField = "name_{$defaultLanguage}";
            $descriptionField = "description_{$defaultLanguage}";

            $nameValue = $this->input($nameField);
            $descriptionValue = $this->input($descriptionField);

            // Log the values for debugging
            Log::info("Validation check for default language {$defaultLanguage}:", [
                'name_field' => $nameField,
                'name_value' => $nameValue,
                'description_field' => $descriptionField,
                'description_value' => $descriptionValue,
                'name_empty' => empty(trim($nameValue)),
                'description_empty' => empty(trim($descriptionValue)),
            ]);

            // Check if name is empty or only whitespace
            if (empty(trim($nameValue))) {
                $validator->errors()->add($nameField, "The {$defaultLanguage} name field is required.");
            }

            // Check if description is empty or only whitespace
            if (empty(trim($descriptionValue))) {
                $validator->errors()->add($descriptionField, "The {$defaultLanguage} description field is required.");
            }

            // Add unique validation for all name fields that have values
            $languages = ['pt', 'en', 'es', 'fr'];
            $roomTypeId = null;
            if ($this->route('roomTypeIdHashed')) {
                $roomTypeId = EasyHashAction::decode($this->route('roomTypeIdHashed'), 'room-type-id');
            }

            foreach ($languages as $language) {
                $fieldName = "name_{$language}";
                $fieldValue = $this->input($fieldName);

                if (!empty(trim($fieldValue))) {
                    $uniqueRule = Rule::unique(RoomTypeModel::class, $fieldName);
                    if ($roomTypeId) {
                        $uniqueRule = $uniqueRule->ignore($roomTypeId);
                    }

                    // Check uniqueness manually
                    $exists = RoomTypeModel::where($fieldName, $fieldValue)
                        ->when($roomTypeId, function ($query) use ($roomTypeId) {
                            return $query->where('id', '!=', $roomTypeId);
                        })
                        ->exists();

                    if ($exists) {
                        $validator->errors()->add($fieldName, "The {$language} name has already been taken.");
                    }
                }
            }
        });
    }
}
