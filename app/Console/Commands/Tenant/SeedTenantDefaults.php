<?php

namespace App\Console\Commands\Tenant;

use Illuminate\Console\Command;
use Database\Seeders\Tenant\_TenantDefaultSeeder;
use Illuminate\Support\Facades\File;
use ReflectionClass;

class SeedTenantDefaults extends Command
{
    protected $signature = 'tenant:seed {tenant_id} {seeder?}';
    protected $description = 'Seed tenant data. Run specific seeder by filename (without .php) or all default seeders if none specified.';

    private $seedersPath;
    private $defaultSeeders = [
        'SettingSeeder',
        'RankSeeder',
        'SectorSeeder',
        'ComoditeSeeder'
    ];

    public function __construct()
    {
        parent::__construct();
        $this->seedersPath = database_path('seeders/Tenant');
    }

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
            // Run specific seeder
            $this->runSpecificSeeder($tenantId, $seeder);
        } else {
            // Run all default seeders
            $this->runDefaultSeeders($tenantId);
        }

        $this->newLine();
        $this->info('Seeding completed successfully.');
        return 0;
    }

    private function runSpecificSeeder($tenantId, $seederName)
    {
        $seederClass = $this->findSeederClass($seederName);

        if (!$seederClass) {
            $this->error("Seeder '$seederName' not found in {$this->seedersPath}");
            $this->listAvailableSeeders();
            return 1;
        }

        $this->outputHeader("Seeding: $seederName for tenant $tenantId");
        $start = microtime(true);
        $this->startSeeder($seederName);

        try {
            (new $seederClass)->run($tenantId);
            $time = $this->getElapsedTime($start);
            $this->completeSeeder($seederName, $time);
        } catch (\Exception $e) {
            $this->output->writeln("<fg=red>ERROR</>");
            $this->error("Failed to run $seederName: " . $e->getMessage());
            return 1;
        }
    }

    private function runDefaultSeeders($tenantId)
    {
        $this->outputHeader("Seeding: All default seeders for tenant $tenantId");

        foreach ($this->defaultSeeders as $seederName) {
            $seederClass = $this->findSeederClass($seederName);

            if (!$seederClass) {
                $this->warn("Default seeder '$seederName' not found, skipping...");
                continue;
            }

            $start = microtime(true);
            $this->startSeeder($seederName);

            try {
                (new $seederClass)->run($tenantId);
                $time = $this->getElapsedTime($start);
                $this->completeSeeder($seederName, $time);
            } catch (\Exception $e) {
                $this->output->writeln("<fg=red>ERROR</>");
                $this->error("Failed to run $seederName: " . $e->getMessage());
                // Continue with other seeders instead of stopping
            }
        }
    }

    private function findSeederClass($seederName)
    {
        // Remove .php extension if provided
        $seederName = str_replace('.php', '', $seederName);

        // Check if file exists
        $filePath = $this->seedersPath . '/' . $seederName . '.php';

        if (!File::exists($filePath)) {
            return null;
        }

        // Get the class name from the file
        $className = $this->getClassNameFromFile($filePath);

        if (!$className) {
            return null;
        }

        $fullClassName = "Database\\Seeders\\Tenant\\$className";

        // Verify the class exists and is instantiable
        if (!class_exists($fullClassName)) {
            return null;
        }

        try {
            $reflection = new ReflectionClass($fullClassName);
            if ($reflection->isInstantiable()) {
                return $fullClassName;
            }
        } catch (\ReflectionException $e) {
            return null;
        }

        return null;
    }

    private function getClassNameFromFile($filePath)
    {
        $content = File::get($filePath);

        // Simple regex to extract class name
        if (preg_match('/class\s+(\w+)\s+extends\s+Seeder/', $content, $matches)) {
            return $matches[1];
        }

        return null;
    }

    private function listAvailableSeeders()
    {
        $this->newLine();
        $this->info('Available seeders:');

        $files = File::files($this->seedersPath);
        $seeders = [];

        foreach ($files as $file) {
            $filename = $file->getFilename();
            if ($filename !== '_TenantDefaultSeeder.php' && str_ends_with($filename, '.php')) {
                $seederName = str_replace('.php', '', $filename);
                $seeders[] = $seederName;
            }
        }

        if (empty($seeders)) {
            $this->warn('No seeders found in ' . $this->seedersPath);
        } else {
            sort($seeders);
            foreach ($seeders as $seeder) {
                $this->line("  - $seeder");
            }
        }

        $this->newLine();
        $this->info('Default seeders (run when no seeder specified):');
        foreach ($this->defaultSeeders as $seeder) {
            $this->line("  - $seeder");
        }
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
