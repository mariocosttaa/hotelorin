<?php

namespace App\Console\Commands\Tenant;

use App\Models\Manager\TenantModel;
use App\Actions\Tenant\TenantTableStructure;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

use Database\Migrations\Tenant\_LineTable;
use Database\Migrations\Tenant\CreateAuditoryTable;
use Database\Migrations\Tenant\CreatePermissionsTable;
use Database\Migrations\Tenant\CreateClientTable;
use Database\Migrations\Tenant\CreatePresenceActivityTable;
use Database\Migrations\Tenant\CreateSectorTable;
use Database\Migrations\Tenant\CreateRoomTypeTable;
use Database\Migrations\Tenant\CreateRankTable;
use Database\Migrations\Tenant\CreateBookingPaymentTable;
use Database\Migrations\Tenant\CreateBookingInvoceTable;
use Database\Migrations\Tenant\CreateAttachmentTable;
use Database\Migrations\Tenant\CreateBookingPeopleTable;
use Database\Migrations\Tenant\CreateRoomTable;
use Database\Migrations\Tenant\CreateRoomGalleryTable;
use Database\Migrations\Tenant\CreateBookingTable;
use Database\Migrations\Tenant\CreatePermissionUserTable;
use Database\Migrations\Tenant\CreateRoomPriceTable;
use Database\Migrations\Tenant\CreateRoomComoditesTable;
use Database\Migrations\Tenant\CreateSettingTable;

class MakeTenantDatabaseEstruxture extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:tenant {tenantId? : The tenant id (optional)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a Database Exstructure for Tenant';

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

        $this->outputHeader('Running migrations.');

        $migrations = TenantTableStructure::getMigrations();

        try {
            $counter = 1;
            foreach ($migrations as $migrationClass) {
                $migrationName = sprintf('0001_01_00_%06d_%s', $counter, class_basename($migrationClass));
                $startTime = microtime(true);
                $this->startMigration($migrationName);
                (new $migrationClass($tenantId))->up();
                $time = $this->getElapsedTime($startTime);
                $this->completeMigration($migrationName, $time);
                $counter++;
            }
            $this->newLine();
            $this->info('All migrations completed successfully.');
        } catch (\Exception $e) {
            $this->error('Error creating tenant database structure: ' . $e->getMessage());
            return false;
        }
        return true;
    }

    private function outputHeader($message)
    {
        $this->newLine();
        $this->components->info($message);
        $this->newLine();
    }

    private function startMigration($migrationName)
    {
        $this->output->write("<fg=blue>INFO</> Running $migrationName ");
        $this->output->write(str_repeat('.', max(0, 70 - strlen($migrationName))));
        $this->output->write(' ');
    }

    private function completeMigration($migrationName, $time)
    {
        $this->output->writeln("<fg=green>DONE</> ({$time})");
    }

    private function getElapsedTime($startTime)
    {
        $elapsed = microtime(true) - $startTime;
        if ($elapsed < 1) {
            return round($elapsed * 1000) . "ms";
        } else if ($elapsed < 60) {
            return round($elapsed, 2) . "s";
        } else {
            $minutes = floor($elapsed / 60);
            $seconds = $elapsed % 60;
            return "{$minutes}m " . round($seconds, 2) . "s";
        }
    }
}
