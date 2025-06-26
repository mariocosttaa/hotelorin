<?php

namespace App\Http\Requests\Panel;

use App\Actions\General\EasyHashAction;
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
 * @method mixed input(string $key = null, mixed $default = null)
 * @method void merge(array $data)
 */
class PanelRoomTypeCreateRequest extends FormRequest
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
            ...$this->getRequiredInputByLanguage(),
            'gallery' => 'nullable|array|max:10',
            'gallery.*' => 'file|mimes:jpeg,png,jpg,gif,svg,mp4,avi,mov,wmv,flv,webm|max:5120',
            'comodites' => 'nullable|array|max:10',
            'comodites.*' => Rule::exists(ComoditeModel::class, 'id'),
        ];
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
