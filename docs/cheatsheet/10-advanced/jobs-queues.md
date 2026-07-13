# Jobs & Queues

> Queue background jobs and process them asynchronously.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Advanced

## Create Job

```bash
php artisan make:job ProcessPodcast
php artisan queue:table && php artisan migrate    # database driver
```

## Define Job

```php
class ProcessPodcast implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int    $tries       = 3;
    public int    $maxExceptions = 1;
    public int    $timeout     = 60;
    public int    $backoff     = 30;                    // seconds before retry
    public int    $backoff     = [30, 60, 120];         // exponential backoff
    public bool   $deleteWhenMissingModels = true;
    public string $queue       = 'podcasts';
    public string $connection  = 'redis';
    public ?int   $uniqueFor   = 3600;                  // unique lock (ShouldBeUnique)
    public string $afterCommit = true;                   // dispatch after DB commit

    public function __construct(private Podcast $podcast) {}

    public function handle(AudioProcessor $processor): void
    {
        $processor->process($this->podcast);
    }

    public function retryUntil(): DateTime
    {
        return now()->addHour();
    }

    public function failed(\Throwable $e): void
    {
        // notify, log, etc.
    }

    public function middleware(): array
    {
        return [new WithoutOverlapping($this->podcast->id)];
    }
}
```

## Dispatch Jobs

```php
ProcessPodcast::dispatch($podcast);
ProcessPodcast::dispatch($podcast)->onQueue('high');
ProcessPodcast::dispatch($podcast)->onConnection('redis');
ProcessPodcast::dispatch($podcast)->delay(now()->addMinutes(10));
ProcessPodcast::dispatchIf($condition, $podcast);
ProcessPodcast::dispatchAfterResponse($podcast);    // after HTTP response sent
dispatch(new ProcessPodcast($podcast));
dispatch_sync(new ProcessPodcast($podcast));         // run synchronously
```

## Chaining Jobs

```php
ProcessPodcast::withChain([
    new OptimizePodcast,
    new ReleasePodcast,
])->dispatch($podcast);

Bus::chain([
    new ProcessPodcast($podcast),
    new OptimizePodcast($podcast),
    new ReleasePodcast($podcast),
])->catch(fn(\Throwable $e) => logger()->error($e))
  ->dispatch();
```

## Batching Jobs

```php
$batch = Bus::batch([
    new ProcessPodcast($podcasts[0]),
    new ProcessPodcast($podcasts[1]),
])->then(fn(Batch $batch) => logger('All done'))
  ->catch(fn(Batch $batch, \Throwable $e) => logger('Error'))
  ->finally(fn(Batch $batch) => logger('Batch complete'))
  ->onQueue('default')
  ->dispatch();

$batch->id;
$batch->progress();
$batch->finished();
$batch->cancelled();
$batch->cancel();
$batch->add([new ProcessPodcast($p)]);  // add more jobs
```

## Queue Commands

```bash
php artisan queue:work
php artisan queue:work --queue=high,default
php artisan queue:listen
php artisan queue:restart
php artisan queue:failed
php artisan queue:retry all
php artisan queue:flush               # delete all failed jobs
php artisan queue:prune-failed --hours=48
```

## Queue Facade

```php
Queue::push(new ProcessPodcast($podcast));
Queue::later(60, new ProcessPodcast($podcast));
Queue::bulk([new Job1, new Job2]);
Queue::size('default');
```

---

**See Also:** [[events-listeners]] | [[task-scheduling]]
