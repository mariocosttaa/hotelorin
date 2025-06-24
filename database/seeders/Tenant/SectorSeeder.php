<?php

namespace Database\Seeders\Tenant;

use Illuminate\Database\Seeder;
use App\Models\Tenant\SectorModel;

class SectorSeeder extends Seeder
{
    public function run()
    {
        $sectors = [
            [
                'name_en' => 'Restaurant',
                'name_pt' => 'Restaurante',
                'name_es' => 'Restaurante',
                'name_fr' => 'Restaurant',
                'description_en' => 'Hotel restaurant',
                'description_pt' => 'Restaurante do hotel',
                'description_es' => 'Restaurante del hotel',
                'description_fr' => 'Restaurant de l\'hôtel',
            ],
            [
                'name_en' => 'Maintenance',
                'name_pt' => 'Manutenção',
                'name_es' => 'Mantenimiento',
                'name_fr' => 'Maintenance',
                'description_en' => 'Maintenance department',
                'description_pt' => 'Departamento de manutenção',
                'description_es' => 'Departamento de mantenimiento',
                'description_fr' => 'Département de maintenance',
            ],
            [
                'name_en' => 'Housekeeping',
                'name_pt' => 'Limpeza',
                'name_es' => 'Limpieza',
                'name_fr' => 'Entretien ménager',
                'description_en' => 'Housekeeping department',
                'description_pt' => 'Departamento de limpeza',
                'description_es' => 'Departamento de limpieza',
                'description_fr' => 'Département d\'entretien ménager',
            ],
            [
                'name_en' => 'Reception',
                'name_pt' => 'Recepção',
                'name_es' => 'Recepción',
                'name_fr' => 'Réception',
                'description_en' => 'Reception area',
                'description_pt' => 'Área de recepção',
                'description_es' => 'Área de recepción',
                'description_fr' => 'Zone de réception',
            ],
            [
                'name_en' => 'Kitchen',
                'name_pt' => 'Cozinha',
                'name_es' => 'Cocina',
                'name_fr' => 'Cuisine',
                'description_en' => 'Hotel kitchen',
                'description_pt' => 'Cozinha do hotel',
                'description_es' => 'Cocina del hotel',
                'description_fr' => 'Cuisine de l\'hôtel',
            ],
            [
                'name_en' => 'Bar',
                'name_pt' => 'Bar',
                'name_es' => 'Bar',
                'name_fr' => 'Bar',
                'description_en' => 'Hotel bar',
                'description_pt' => 'Bar do hotel',
                'description_es' => 'Bar del hotel',
                'description_fr' => 'Bar de l\'hôtel',
            ],
            [
                'name_en' => 'Security',
                'name_pt' => 'Segurança',
                'name_es' => 'Seguridad',
                'name_fr' => 'Sécurité',
                'description_en' => 'Security department',
                'description_pt' => 'Departamento de segurança',
                'description_es' => 'Departamento de seguridad',
                'description_fr' => 'Département de sécurité',
            ],
            [
                'name_en' => 'Spa',
                'name_pt' => 'Spa',
                'name_es' => 'Spa',
                'name_fr' => 'Spa',
                'description_en' => 'Hotel spa',
                'description_pt' => 'Spa do hotel',
                'description_es' => 'Spa del hotel',
                'description_fr' => 'Spa de l\'hôtel',
            ],
            [
                'name_en' => 'Laundry',
                'name_pt' => 'Lavanderia',
                'name_es' => 'Lavandería',
                'name_fr' => 'Blanchisserie',
                'description_en' => 'Laundry department',
                'description_pt' => 'Departamento de lavanderia',
                'description_es' => 'Departamento de lavandería',
                'description_fr' => 'Département de blanchisserie',
            ],
        ];

        foreach ($sectors as $sector) {
            SectorModel::updateOrCreate([
                'name_en' => $sector['name_en'],
            ], $sector);
        }
    }
}
