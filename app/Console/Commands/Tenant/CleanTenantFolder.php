<?php

namespace App\Console\Commands\Tenant;

use App\Models\Manager\TenantModel;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class CleanTenantFolder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tenant:clean-folder
                            {tenantId : The tenant ID}
                            {folder : The folder type (public or private)}
                            {--force : Skip tenant existence check and confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean tenant folder in storage (only works in debug mode and not in production)';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // Check if debug mode is enabled
        if (!config('app.debug')) {
            $this->error('This command only works when APP_DEBUG is set to true.');
            $this->info('Set APP_DEBUG=true in your .env file to use this command.');
            return 1;
        }

        // Check if application is in production
        if (config('app.env') === 'production') {
            $this->error('This command cannot be executed in production environment.');
            $this->info('This command is only available in development/staging environments.');
            return 1;
        }

        $tenantId = $this->argument('tenantId');
        $folderType = strtolower($this->argument('folder'));
        $force = $this->option('force');

        // Validate tenant ID
        if (!is_numeric($tenantId) || $tenantId <= 0) {
            $this->error('The tenant ID must be a positive integer.');
            return 1;
        }

        // Validate folder type
        if (!in_array($folderType, ['public', 'private'])) {
            $this->error('The folder type must be either "public" or "private".');
            return 1;
        }

        $this->info("Cleaning {$folderType} folder for tenant ID: {$tenantId}");

        // Confirm the action (skip if force option is used)
        if (!$force && !$this->confirm('Are you sure you want to delete all files in this tenant folder? This action cannot be undone.')) {
            $this->info('Operation cancelled.');
            return 0;
        }

        try {
            $folderPath = $this->getTenantFolderPath($tenantId, $folderType);

            if (!File::exists($folderPath)) {
                $this->warn("Tenant folder does not exist: {$folderPath}");
                $this->info('No files to clean.');
                return 0;
            }

            // Count files before deletion
            $fileCount = $this->countFilesInDirectory($folderPath);

            if ($fileCount === 0) {
                $this->info('No files found in the tenant folder.');
                return 0;
            }

            $this->info("Found {$fileCount} files/directories to delete.");

            // Delete the entire tenant folder
            File::deleteDirectory($folderPath);

            $this->info("Successfully cleaned {$folderType} folder for tenant ID: {$tenantId}");
            $this->info("Deleted {$fileCount} files/directories.");

        } catch (\Exception $e) {
            $this->error('Error cleaning tenant folder: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }

    /**
     * Get the full path to the tenant folder
     *
     * @param int $tenantId
     * @param string $folderType
     * @return string
     */
    private function getTenantFolderPath(int $tenantId, string $folderType): string
    {
        $basePath = storage_path("app/{$folderType}");

        if ($folderType === 'public') {
            return $basePath . "/tenants/{$tenantId}";
        }

        return $basePath . "/tenants/{$tenantId}";
    }

    /**
     * Count files and directories in a directory recursively
     *
     * @param string $path
     * @return int
     */
    private function countFilesInDirectory(string $path): int
    {
        if (!File::exists($path)) {
            return 0;
        }

        $count = 0;
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($path, \RecursiveDirectoryIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::SELF_FIRST
        );

        foreach ($iterator as $file) {
            $count++;
        }

        return $count;
    }
}
