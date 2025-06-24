<?php

namespace Database\Seeders\Tenant;

use Illuminate\Database\Seeder;
use App\Models\Tenant\RankModel;

class RankSeeder extends Seeder
{
    public function run()
    {
        $ranks = [
            [
                'name_en' => 'Guest',
                'name_pt' => 'Convidado',
                'name_es' => 'Invitado',
                'name_fr' => 'Invité',
                'description_en' => 'A temporary visitor or customer of the hotel.',
                'description_pt' => 'Um visitante temporário ou cliente do hotel.',
                'description_es' => 'Un visitante temporal o cliente del hotel.',
                'description_fr' => 'Un visiteur temporaire ou client de l\'hôtel.',
                'level' => 1,
            ],
            [
                'name_en' => 'Employee',
                'name_pt' => 'Funcionário',
                'name_es' => 'Empleado',
                'name_fr' => 'Employé',
                'description_en' => 'A staff member responsible for daily hotel operations.',
                'description_pt' => 'Um membro da equipe responsável pelas operações diárias do hotel.',
                'description_es' => 'Un miembro del personal responsable de las operaciones diarias del hotel.',
                'description_fr' => 'Un membre du personnel responsable des opérations quotidiennes de l\'hôtel.',
                'level' => 2,
            ],
            [
                'name_en' => 'Supervisor',
                'name_pt' => 'Supervisor',
                'name_es' => 'Supervisor',
                'name_fr' => 'Superviseur',
                'description_en' => 'Oversees and coordinates the work of employees in a department.',
                'description_pt' => 'Supervisiona e coordena o trabalho dos funcionários em um departamento.',
                'description_es' => 'Supervisa y coordina el trabajo de los empleados en un departamento.',
                'description_fr' => 'Supervise et coordonne le travail des employés dans un département.',
                'level' => 3,
            ],
            [
                'name_en' => 'Manager',
                'name_pt' => 'Gerente',
                'name_es' => 'Gerente',
                'name_fr' => 'Gérant',
                'description_en' => 'Responsible for managing hotel departments and staff.',
                'description_pt' => 'Responsável por gerenciar departamentos e equipe do hotel.',
                'description_es' => 'Responsable de gestionar los departamentos y el personal del hotel.',
                'description_fr' => 'Responsable de la gestion des départements et du personnel de l\'hôtel.',
                'level' => 4,
            ],
            [
                'name_en' => 'Administrator',
                'name_pt' => 'Administrador',
                'name_es' => 'Administrador',
                'name_fr' => 'Administrateur',
                'description_en' => 'Oversees all hotel operations and makes executive decisions.',
                'description_pt' => 'Supervisiona todas as operações do hotel e toma decisões executivas.',
                'description_es' => 'Supervisa todas las operaciones del hotel y toma decisiones ejecutivas.',
                'description_fr' => 'Supervise toutes les opérations de l\'hôtel et prend des décisions exécutives.',
                'level' => 5,
            ],
        ];

        foreach ($ranks as $rank) {
            RankModel::updateOrCreate([
                'level' => $rank['level'],
            ], $rank);
        }
    }
}
