# Debugging & Monitoring

## Logging Configuration

### Log Channels
```php
// config/logging.php
'default' => env('LOG_CHANNEL', 'stack'),

'channels' => [
    'single' => [
        'driver' => 'single',
        'path' => storage_path('logs/laravel.log'),
        'level' => env('LOG_LEVEL', 'debug'),
    ],
    'daily' => [
        'driver' => 'daily',
        'path' => storage_path('logs/laravel.log'),
        'days' => 14,
    ],
    'slack' => [
        'driver' => 'slack',
        'url' => env('LOG_SLACK_WEBHOOK_URL'),
        'level' => 'critical',
    ],
]
```

### Writing Logs
```php
// Different log levels
Log::debug('Debug message');
Log::info('Informational message');
Log::notice('Notice message');
Log::warning('Warning message');
Log::error('Error message');
Log::critical('Critical message');
Log::alert('Alert message');
Log::emergency('Emergency message');

// With context
Log::info('User logged in', [
    'user_id' => $user->id,
    'ip' => $request->ip(),
]);

// Log channel
Log::channel('slack')->critical('Critical error occurred', [
    'error' => $exception->getMessage(),
]);
```

## Debugging Tools

### Laravel Tinker (REPL)
```bash
php artisan tinker

# In tinker
>>> User::find(1)
>>> User::where('email', 'test@example.com')->first()
>>> Post::factory(5)->create()
>>> DB::table('users')->count()
```

### Debug Bar
```bash
composer require --dev barryvdh/laravel-debugbar
```

### Debugging Variables
```php
// Dump and die
dd($variable);
dd($user, $post);

// Dump
dump($variable);

// In views
{{ dd($variable) }}
```

## Query Debugging

### Log SQL Queries
```php
// Log all queries in development
if (config('app.debug')) {
    DB::listen(function ($query) {
        Log::debug($query->sql, $query->bindings);
    });
}
```

### Explain Query
```php
// Show query plan
$posts = Post::where('published', true);
$posts->explain();
```

### DB::listen() with Details
```php
DB::listen(function ($query) {
    Log::info('Query Time: ' . $query->time . 'ms');
    Log::info('SQL: ' . $query->sql);
    Log::info('Bindings: ' . json_encode($query->bindings));
});
```

## Performance Profiling

### Query Profiler
```php
$startTime = microtime(true);

// Code to profile
$posts = Post::with('author')->get();

$endTime = microtime(true);
Log::info('Execution time: ' . ($endTime - $startTime) . ' seconds');
```

### Using Clockwork
```bash
composer require --dev itsgoingd/clockwork
```

### Memory Usage
```php
$startMemory = memory_get_usage();

// Code to profile
$users = User::all();

$endMemory = memory_get_usage();
Log::info('Memory used: ' . ($endMemory - $startMemory) / 1024 . ' KB');
```

## Error Handling

### Custom Exception Handler
```php
// app/Exceptions/Handler.php
public function register()
{
    $this->reportable(function (Throwable $e) {
        if ($this->shouldReport($e)) {
            // Send to error tracking service
            Log::error($e->getMessage(), [
                'exception' => $e,
            ]);
        }
    });

    $this->renderable(function (Exception $e, $request) {
        if ($request->wantsJson()) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    });
}
```

## Error Tracking Integration

### Sentry Integration
```bash
composer require sentry/sentry-laravel
php artisan vendor:publish --provider="Sentry\Laravel\ServiceProvider"
```

### Configure Sentry
```env
SENTRY_DSN=https://key@sentry.io/project-id
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=1.0
```

### Use Sentry
```php
\Sentry\captureException($exception);
\Sentry\captureMessage('Something happened');
```

## Monitoring Tools

### Health Check Endpoint
```php
Route::get('/health', function () {
    $status = [
        'database' => 'disconnected',
        'cache' => 'disconnected',
    ];

    try {
        DB::connection()->getPdo();
        $status['database'] = 'connected';
    } catch (\Throwable $e) {
        Log::error('Database connection failed', ['error' => $e->getMessage()]);
    }

    try {
        Cache::get('health_check');
        $status['cache'] = 'working';
    } catch (\Throwable $e) {
        Log::error('Cache not working', ['error' => $e->getMessage()]);
    }

    return response()->json([
        'status' => 'ok',
        'checks' => $status,
        'timestamp' => now(),
    ]);
});
```

### Uptime Monitoring
```bash
# Monitor with services like:
# - Pingdom
# - UptimeRobot
# - Datadog
# - New Relic
```

## Application Performance Monitoring (APM)

### New Relic Integration
```bash
composer require newrelic/newrelic-php-agent
```

### Datadog Integration
```bash
composer require datadog/dd-trace
```

## Logging Best Practices

### Structured Logging
```php
Log::info('User action', [
    'user_id' => $user->id,
    'action' => 'login',
    'ip_address' => $request->ip(),
    'user_agent' => $request->userAgent(),
    'timestamp' => now()->toIso8601String(),
]);
```

### Avoid Logging Sensitive Data
```php
// DON'T log passwords, tokens, credit cards
// DO log user IDs, actions, timestamps

Log::info('User authenticated', [
    'user_id' => $user->id,
    'method' => 'password', // not the password itself
]);
```

## See Also
- [[error-handling]]
- [[query-optimization]]
- [[performance-profiling]]
