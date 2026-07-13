# Events & Listeners

> Dispatch events and listen for them throughout your application.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Advanced

## Create Event & Listener

```bash
php artisan make:event PostPublished
php artisan make:listener SendPublishNotification --event=PostPublished
```

## Event Class

```php
class PostPublished
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Post $post) {}

    public function broadcastOn(): array 
    { 
        return []; 
    }
}
```

## Listener Class

```php
class SendPublishNotification implements ShouldQueue
{
    use InteractsWithQueue;

    public int $tries = 3;
    public int $backoff = 60;

    public function handle(PostPublished $event): void
    {
        // $event->post
    }

    public function failed(PostPublished $event, \Throwable $e): void
    {
        // handle failure
    }
}
```

## Register Listeners

Auto-discovered in L11+, or register manually in AppServiceProvider::boot:

```php
Event::listen(PostPublished::class, SendPublishNotification::class);
Event::listen(PostPublished::class, function (PostPublished $event) { ... });
Event::listen('eloquent.created: *', fn($event, $data) => ...);  // wildcard
```

## Dispatch Events

```php
PostPublished::dispatch($post);
event(new PostPublished($post));
PostPublished::dispatchIf($condition, $post);
PostPublished::dispatchUnless($condition, $post);
```

## Testing Events

```php
Event::fake();
Event::fake([PostPublished::class]);
Event::assertDispatched(PostPublished::class);
Event::assertDispatched(PostPublished::class, fn($e) => $e->post->id === 1);
Event::assertDispatchedTimes(PostPublished::class, 2);
Event::assertNotDispatched(PostPublished::class);
Event::assertNothingDispatched();
```

---

**See Also:** [[jobs-queues]] | [[listeners]]
