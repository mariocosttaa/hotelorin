<?php

namespace App\Console\Commands\Tenant;

use App\Models\Manager\TenantModel;

use Database\Migrations\Tenant\CreateIconsTable;
use Database\Migrations\Tenant\CreateNetworksTable;
use Database\Migrations\Tenant\CreateAircraftsTable;
use Database\Migrations\Tenant\CreateAirlineTable;
use Database\Migrations\Tenant\CreateRanksTable;
use Database\Migrations\Tenant\CreateRolesTable;
use Database\Migrations\Tenant\CreateReservedFlightsTable;
use Database\Migrations\Tenant\CreateCharterFlightTable;
use Database\Migrations\Tenant\CreateDownloadsTable;
use Database\Migrations\Tenant\CreateFlightsTable;
use Database\Migrations\Tenant\CreateEventsTable;
use Database\Migrations\Tenant\CreateIntraEmailTable;
use Database\Migrations\Tenant\CreateNotificationTable;
use Database\Migrations\Tenant\CreatePermissionsTable;
use Database\Migrations\Tenant\CreateScheduleFlightTable;
use Database\Migrations\Tenant\CreateToursTable;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class DestroyTenantDatabaseEstruxture extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'destroy:tenantDb {tenantId? : The tenant id (optional)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Destroy a Database Exstructure for Tenant';

    /**
     * The type of class being generated.
     *
     * @var string
     */
    protected $type = 'Action';

    /**
     * Execute the console command.
     *
     * @return bool|null
     */
    public function handle()
    {
        $tenantId = $this->argument('tenantId');

        if(empty($tenantId)) {
            $tenantId = $this->ask('Please provide the tenant ID');
        }

        if(!is_numeric($tenantId) || $tenantId <= 0) {
            $this->error('The tenant ID must be a positive integer.');
            return false;
        }

        // Exibe o cabeçalho
        $this->info('Rolling back migrations.');

        // Array de migrações em ordem reversa para rollback
        $migrations = [
            ['class' => CreateFlightsTable::class, 'name' => 'flights_table'],
            ['class' => CreateEventsTable::class, 'name' => 'events_table'],
            ['class' => CreateToursTable::class, 'name' => 'tours_table'],
            ['class' => CreateNetworksTable::class, 'name' => 'networks_table'],
            ['class' => CreateIconsTable::class, 'name' => 'icons_table'],
            ['class' => CreateReservedFlightsTable::class, 'name' => 'reserved_flights_table'],
            ['class' => CreateScheduleFlightTable::class, 'name' => 'schedule_flight_table'],
            ['class' => CreateCharterFlightTable::class, 'name' => 'charter_flight_table'],
            ['class' => CreateAircraftsTable::class, 'name' => 'aircrafts_table'],
            ['class' => CreatePermissionsTable::class, 'name' => 'permissions_table'],
            ['class' => CreateAirlineTable::class, 'name' => 'airline_table'],
            ['class' => CreateRanksTable::class, 'name' => 'ranks_table'],
            ['class' => CreateRolesTable::class, 'name' => 'roles_table'],
            ['class' => CreateNotificationTable::class, 'name' => 'notification_table'],
            ['class' => CreateIntraEmailTable::class, 'name' => 'intra_email_table'],
            ['class' => CreateDownloadsTable::class, 'name' => 'downloads_table'],
        ];

        try {
            $counter = 1;

            foreach ($migrations as $migration) {
                $startTime = microtime(true);

                // Executa o rollback da migração
                new $migration['class']($tenantId)->down();

                $endTime = microtime(true);
                $executionTime = ($endTime - $startTime) * 1000; // Converte para milissegundos

                // Formata o nome da migração com padding
                $migrationName = sprintf(
                    '0001_01_00_%06d_%s',
                    $counter,
                    $migration['name']
                );

                // Cria os pontos para alinhamento
                $dots = str_repeat('.', max(1, 120 - strlen($migrationName)));

                // Formata o tempo de execução
                if ($executionTime < 1000) {
                    $timeFormatted = sprintf('%.2fms', $executionTime);
                } else {
                    $timeFormatted = sprintf('%.2fs', $executionTime / 1000);
                }

                // Exibe a linha formatada
                $this->line(sprintf(
                    '%s %s %s <info>DONE</info>',
                    $migrationName,
                    $dots,
                    $timeFormatted
                ));

                $counter++;
            }

            $this->info('Tenant database structure destroyed successfully.');

        } catch (\Exception $e) {
            $this->error('Error Destroying Tenant database structure: ' . $e->getMessage());
            return false;
        }

        return true;
    }
}
