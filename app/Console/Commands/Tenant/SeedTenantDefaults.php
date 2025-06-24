<?php

namespace App\Console\Commands\Tenant;

use Illuminate\Console\Command;
use Database\Seeders\Tenant\_TenantDefaultSeeder;
use Database\Seeders\Tenant\RankSeeder;
use Database\Seeders\Tenant\SectorSeeder;

class SeedTenantDefaults extends Command
{
    protected $signature = 'tenant:seed {tenant_id} {seeder?}';
    protected $description = 'Seed default ranks, sectors, or all for a given tenant. Optionally specify a seeder.';

    public function handle()
    {
        $tenantId = $this->argument('tenant_id');
        config(['tenantId' => $tenantId]);
        $seeder = $this->argument('seeder');
        if (!$tenantId) {
            $this->error('Tenant ID is required.');
            return 1;
        }

        // Optionally: Set tenant DB connection context here if needed
        // Example: TenantManager::setConnection($tenantId);

        if ($seeder) {
            $seederClass = null;
            $seederName = null;
            switch (strtolower($seeder)) {
                case 'rank':
                case 'rankseeder':
                    $seederClass = RankSeeder::class;
                    $seederName = 'RankSeeder';
                    break;
                case 'sector':
                case 'sectorseeder':
                    $seederClass = SectorSeeder::class;
                    $seederName = 'SectorSeeder';
                    break;
                default:
                    $this->error('Unknown seeder: ' . $seeder);
                    return 1;
            }
            if ($seederName) {
                $this->outputHeader("Seeding: $seederName for tenant $tenantId");
                $start = microtime(true);
                $this->startSeeder($seederName);
                (new $seederClass)->run($tenantId);
                $time = $this->getElapsedTime($start);
                $this->completeSeeder($seederName, $time);
            }
        } else {
            $this->outputHeader("Seeding: All default seeders for tenant $tenantId");
            $seeders = [
                'RankSeeder' => RankSeeder::class,
                'SectorSeeder' => SectorSeeder::class,
            ];
            foreach ($seeders as $name => $class) {
                $start = microtime(true);
                $this->startSeeder($name);
                (new $class)->run($tenantId);
                $time = $this->getElapsedTime($start);
                $this->completeSeeder($name, $time);
            }
        }
        $this->newLine();
        $this->info('Seeding completed successfully.');
        return 0;
    }

    private function outputHeader($message)
    {
        $this->newLine();
        $this->components->info($message);
        $this->newLine();
    }

    private function startSeeder($seederName)
    {
        $this->output->write("<fg=blue>INFO</> Running $seederName ");
        $this->output->write(str_repeat('.', max(0, 70 - strlen($seederName))));
        $this->output->write(' ');
    }

    private function completeSeeder($seederName, $time)
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
