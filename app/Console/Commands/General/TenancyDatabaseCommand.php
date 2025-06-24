<?php

namespace App\Console\Commands\General;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\App;

class TenancyDatabaseCommand extends Command
{
    protected $signature = 'tenant-:database {sql? : The raw SQL to execute} {--drop-all : Drop all tables in the tenant database}';
    protected $description = 'Run raw SQL on the tenant database connection or drop all tables with --drop-all';

    public function handle()
    {
        if ($this->option('drop-all')) {
            if (!config('app.debug') || config('app.env') === 'production') {
                $this->error('The --drop-all option is only allowed when APP_DEBUG=true and APP_ENV is not production.');
                return;
            }
            try {
                DB::connection('tenants')->statement('SET FOREIGN_KEY_CHECKS = 0;');
                $tables = DB::connection('tenants')->select("SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = DATABASE();");
                foreach ($tables as $table) {
                    $tableName = $table->TABLE_NAME;
                    DB::connection('tenants')->statement("DROP TABLE IF EXISTS `{$tableName}`;");
                }
                DB::connection('tenants')->statement('SET FOREIGN_KEY_CHECKS = 1;');
                $this->info('All tables dropped successfully from tenant database.');
            } catch (\Exception $e) {
                $this->error($e->getMessage());
            }
            return;
        }

        $sql = $this->argument('sql');
        if (!$sql) {
            $this->error('You must provide SQL to execute or use --drop-all.');
            return;
        }
        try {
            $result = DB::connection('tenants')->select($sql);
            $this->info(json_encode($result, JSON_PRETTY_PRINT));
        } catch (\Exception $e) {
            $this->error($e->getMessage());
        }
    }
}
