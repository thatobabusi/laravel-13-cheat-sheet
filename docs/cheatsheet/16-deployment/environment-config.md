# Environment Configuration & Deployment

## Environment Setup

### .env Configuration
```env
APP_NAME=Laravel
APP_ENV=production
APP_KEY=base64:...
APP_DEBUG=false
APP_URL=https://example.com
APP_TIMEZONE=UTC

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_app
DB_USERNAME=root
DB_PASSWORD=secret

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=cookie

MAIL_DRIVER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=xxx
MAIL_PASSWORD=xxx

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

LOG_CHANNEL=stack
LOG_LEVEL=info
```

### Environment-Specific Config
```php
// config/app.php
'debug' => env('APP_DEBUG', false),
'url' => env('APP_URL', 'http://localhost'),
'timezone' => env('APP_TIMEZONE', 'UTC'),

// Only debug in development
if (env('APP_ENV') === 'local') {
    // Development-only code
}
```

## Configuration Caching

### Cache Configuration
```bash
# Production
php artisan config:cache

# Clear cache
php artisan config:clear
```

### Environment Variables in Production
```php
// Access in code
$apiKey = env('EXTERNAL_API_KEY');

// With default
$timeout = env('REQUEST_TIMEOUT', 30);
```

## Database Migrations in Production

### Safe Migration Strategy
```bash
# Test migrations locally first
php artisan migrate --env=local

# Run migrations
php artisan migrate --force

# Rollback if needed
php artisan migrate:rollback --force

# Refresh database (DANGEROUS in production)
php artisan migrate:refresh --force
```

### Zero-Downtime Deployment
```php
// 1. Make new columns nullable
Schema::table('users', function (Blueprint $table) {
    $table->string('username')->nullable();
});

// 2. Deploy code that uses new column
// 3. Backfill data
// 4. Add NOT NULL constraint

Schema::table('users', function (Blueprint $table) {
    $table->string('username')->change();
});

// 5. Deploy removal of old code
```

## SSL/HTTPS Setup

### Force HTTPS
```php
// app/Providers/AppServiceProvider.php
public function boot()
{
    if ($this->app->environment('production')) {
        \Illuminate\Support\Facades\URL::forceScheme('https');
    }
}

// Or in Middleware
public function handle($request, Closure $next)
{
    if (!$request->secure() && env('APP_ENV') === 'production') {
        return redirect()->secure($request->getRequestUri());
    }
    return $next($request);
}
```

### Let's Encrypt with Certbot
```bash
# Install certificate
sudo certbot certonly --standalone -d example.com

# Auto-renew
0 12 * * * /usr/bin/certbot renew --quiet
```

## Server Optimization

### PHP Configuration
```
upload_max_filesize = 100M
post_max_size = 100M
memory_limit = 256M
max_execution_time = 300
```

### Nginx Configuration
```nginx
upstream laravel {
    server app:9000;
}

server {
    listen 80;
    server_name example.com;
    root /var/www/public;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass laravel;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### Apache Configuration
```apache
<VirtualHost *:80>
    ServerName example.com
    DocumentRoot /var/www/public

    <Directory /var/www>
        AllowOverride All
        Require all granted
    </Directory>

    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteCond %{REQUEST_URI} !^/public/
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^ /index.php [L]
    </IfModule>
</VirtualHost>
```

## Deployment Process

### Manual Deployment Steps
```bash
# 1. SSH into server
ssh user@example.com

# 2. Go to application directory
cd /var/www/app

# 3. Pull latest code
git pull origin main

# 4. Install dependencies
composer install --optimize-autoloader --no-dev

# 5. Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 6. Run migrations
php artisan migrate --force

# 7. Restart queue workers
php artisan queue:restart

# 8. Restart application
sudo service php-fpm restart
sudo service nginx restart
```

### Using Deployer
```bash
# Install Deployer
composer require deployer/deployer --dev

# Initialize deployment config
php vendor/bin/dep init

# Deploy
php vendor/bin/dep deploy production
```

## Monitoring & Health Checks

### Health Check Endpoint
```php
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'database' => \DB::connection()->getPdo() ? 'connected' : 'disconnected',
        'cache' => \Cache::get('health_check_test') !== null ? 'working' : 'not working',
    ]);
});
```

### Logging Configuration
```php
// config/logging.php
'channels' => [
    'stack' => [
        'driver' => 'stack',
        'channels' => ['single', 'slack'],
    ],
    'slack' => [
        'driver' => 'slack',
        'url' => env('LOG_SLACK_WEBHOOK_URL'),
        'level' => 'critical',
    ],
]
```

## See Also
- [[database-migrations]]
- [[monitoring-logging]]
- [[ssl-https-security]]
