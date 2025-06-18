-- Create manager database
CREATE DATABASE IF NOT EXISTS manager;

-- Create tenant database
CREATE DATABASE IF NOT EXISTS tenancies;

-- Grant privileges to sail user for both databases
GRANT ALL PRIVILEGES ON manager.* TO 'sail'@'%';
GRANT ALL PRIVILEGES ON tenancies.* TO 'sail'@'%';

-- Flush privileges
FLUSH PRIVILEGES;
