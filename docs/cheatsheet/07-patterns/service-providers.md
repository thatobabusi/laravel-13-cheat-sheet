# Service Providers

> Register bindings and configure services in providers.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Patterns

## Basic Service Provider

```php
// app/Providers/AppServiceProvider.php
class AppServiceProvider extends ServiceProvider
{
    // Bindings array (registered before boot)
    public array $bindings = [
        PaymentGateway::class => StripeGateway::class,
    ];

    public array $singletons = [
        ApiClient::class => ApiClient::class,
    ];

    public function register(): void
    {
        // Bind to container — NO facades available here
        $this->app->singleton(ReportGenerator::class, fn($app) => new ReportGenerator(
            $app->make(PdfRenderer::class)
        ));
    }

    public function boot(): void
    {
        // Facades available here
        View::share('appName', config('app.name'));
        Gate::define('admin', fn($user) => $user->is_admin);
        Route::model('post', Post::class);
        Validator::extend('uppercase', fn($a, $v) => strtoupper($v) === $v);
        Model::preventLazyLoading(!$this->app->isProduction());
        DB::prohibitDestructiveCommands($this->app->isProduction());
        Post::observe(PostObserver::class);
    }

    public function provides(): array
    {
        return [ReportGenerator::class];   // for deferred providers
    }
}
```

## Deferred Providers

Providers can defer binding registration until actually needed:

```php
public function register(): void
{
    $this->app->singleton(ExpensiveService::class, function ($app) {
        return new ExpensiveService();
    });
}

public function provides(): array
{
    return [ExpensiveService::class];
}
```

---

**See Also:** [[service-container]] | [[bootstrap-app]]
