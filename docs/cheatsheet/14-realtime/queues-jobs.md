# Queues & Jobs

## Queue Configuration

### Configure Queue Driver
```php
// config/queue.php
'default' => env('QUEUE_CONNECTION', 'sync'),

'connections' => [
    'sync' => [
        'driver' => 'sync',
    ],
    'database' => [
        'driver' => 'database',
        'table' => 'jobs',
        'queue' => 'default',
    ],
    'redis' => [
        'driver' => 'redis',
        'connection' => 'default',
        'queue' => 'default',
    ],
    'sqs' => [
        'driver' => 'sqs',
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'prefix' => env('SQS_PREFIX', 'https://sqs.us-east-1.amazonaws.com/123456789012'),
        'queue' => env('SQS_QUEUE', 'default'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],
],
```

### Create Migrations
```bash
php artisan queue:table
php artisan queue:failed-jobs
php artisan migrate
```

## Creating Jobs

### Generate Job
```bash
php artisan make:job ProcessPost
```

### Job Structure
```php
namespace App\Jobs;

class ProcessPost implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Post $post) {}

    public function handle()
    {
        // Process post
        $this->post->process();
    }
}
```

## Dispatching Jobs

### Dispatch Immediately
```php
ProcessPost::dispatch($post);

// With delay
ProcessPost::dispatch($post)->delay(now()->addMinutes(10));

// To specific queue
ProcessPost::dispatch($post)->onQueue('emails');
```

### Chain Jobs
```php
Bus::chain([
    new ProcessPost($post),
    new PublishPost($post),
    new NotifyUsers($post),
])->dispatch();
```

### Dispatch Sync (Immediately)
```php
ProcessPost::dispatchSync($post);
```

## Job Configuration

### Retry Policy
```php
class ProcessPost implements ShouldQueue
{
    public $tries = 3;
    public $maxExceptions = 1;
    public $backoff = [1, 5, 10]; // seconds

    public function failed(Throwable $exception)
    {
        // Handle failure
        Log::error('Job failed: ' . $exception->getMessage());
    }
}
```

### Job Timeout
```php
class ProcessPost implements ShouldQueue
{
    public $timeout = 120; // seconds
}
```

### Unique Jobs (No Duplicates)
```php
class ProcessPost implements ShouldQueue, ShouldBeUnique
{
    public function uniqueId()
    {
        return "post-{$this->post->id}";
    }

    public function uniqueFor()
    {
        return 60 * 60; // 1 hour
    }
}
```

## Task Scheduling

### Schedule Commands
```php
// app/Console/Kernel.php
protected function schedule(Schedule $schedule)
{
    // Run every minute
    $schedule->command('posts:publish')->everyMinute();

    // Run daily at 2am
    $schedule->command('backup:run')->dailyAt('02:00');

    // Run on weekdays at 9am
    $schedule->command('reports:generate')
        ->weekdays()
        ->at('09:00');

    // Run every hour
    $schedule->command('cache:clear')->hourly();

    // Run every 30 minutes
    $schedule->command('sync:data')->everyThirtyMinutes();
}
```

### Schedule Frequency Options
```php
$schedule->command('posts:publish')
    ->everyMinute()           // Every minute
    ->everyTwoMinutes()       // Every 2 minutes
    ->everyFiveMinutes()      // Every 5 minutes
    ->everyTenMinutes()       // Every 10 minutes
    ->everyFifteenMinutes()   // Every 15 minutes
    ->everyThirtyMinutes()    // Every 30 minutes
    ->hourly()                // Every hour
    ->daily()                 // Every day
    ->dailyAt('13:00')        // Specific time
    ->twiceDaily(1, 13)       // Twice daily
    ->weekly()                // Every week
    ->weeklyOn(1, '8:00')     // Monday 8am
    ->monthly()               // First day of month
    ->quarterly()             // First day of quarter
    ->yearly()                // First day of year
    ->timezone('America/Chicago');
```

### Closures in Scheduler
```php
$schedule->call(function () {
    Post::where('published_at', '<', now()->subDay())->delete();
})->daily();
```

## Running Jobs

### Start Queue Worker
```bash
# Start worker
php artisan queue:work

# With specific queue
php artisan queue:work --queue=emails,default

# With memory limit
php artisan queue:work --memory=256
```

### Monitor Jobs
```php
// Check failed jobs
php artisan queue:failed

// Retry failed job
php artisan queue:retry {id}

// Flush all failed jobs
php artisan queue:flush
```

### Horizon (Queue Dashboard)
```bash
composer require laravel/horizon
php artisan horizon:install

# Access at /horizon
```

## Job Events

### Listen to Job Events
```php
// app/Providers/EventServiceProvider.php
use Illuminate\Queue\Events\JobProcessed;
use Illuminate\Queue\Events\JobFailed;

protected $listen = [
    JobProcessed::class => [
        'App\Listeners\LogProcessedJob',
    ],
    JobFailed::class => [
        'App\Listeners\LogFailedJob',
    ],
];
```

## Rate Limiting

### Throttle Jobs
```php
use Illuminate\Queue\Middleware\RateLimited;

class SendEmail implements ShouldQueue
{
    public function middleware()
    {
        return [new RateLimited('emails')];
    }
}

// Configure in kernel.php
protected $routeMiddleware = [
    'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
];
```

## See Also
- [[task-scheduling]]
- [[event-broadcasting]]
- [[notifications]]
