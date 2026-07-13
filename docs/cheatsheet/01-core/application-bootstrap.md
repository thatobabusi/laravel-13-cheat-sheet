# Application Bootstrap

> Configure middleware, routing, and exceptions in `bootstrap/app.php`.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Core Framework

Laravel 13 configures the application in `bootstrap/app.php` using the fluent `Application::configure()` builder pattern.

## Basic Setup

```php
// bootstrap/app.php
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',                           // built-in health check endpoint
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Configure middleware here
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Configure exception handling here
    })
    ->create();
```

## Middleware Configuration

```php
->withMiddleware(function (Middleware $middleware) {
    // Append / prepend global middleware
    $middleware->append(MyMiddleware::class);
    $middleware->prepend(MyMiddleware::class);

    // Alias
    $middleware->alias(['auth.custom' => MyAuthMiddleware::class]);

    // Middleware groups
    $middleware->appendToGroup('web', MyWebMiddleware::class);
    $middleware->appendToGroup('api', MyApiMiddleware::class);

    // Throttle
    $middleware->throttleApi('60,1');        // 60 req/minute
    $middleware->throttleApi(             // per-second limiting (L11+)
        limiter: 'api',
        perSecond: 5,
    );

    // Exclude routes from middleware
    $middleware->validateCsrfTokens(except: ['/stripe/webhook']);

    // Stateless API (skip sessions)
    $middleware->statefulApi();

    // Trust proxies
    $middleware->trustProxies(at: '*');
    $middleware->trustHosts(at: ['laravel.com']);

    // Redirect guests
    $middleware->redirectGuestsTo('/login');
    $middleware->redirectUsersTo('/dashboard');
})
```

## Exception Handling

```php
->withExceptions(function (Exceptions $exceptions) {
    // Custom rendering
    $exceptions->render(function (ModelNotFoundException $e, Request $req) {
        return response()->json(['message' => 'Not found'], 404);
    });

    // Reportable
    $exceptions->report(function (InvalidOrderException $e) {
        // custom logging
    })->stop();                              // don't bubble to default handler

    // Don't report certain exceptions
    $exceptions->dontReport(PaymentDeclinedException::class);
    $exceptions->dontFlash(['password', 'password_confirmation']);

    // Throttle exception reporting
    $exceptions->throttle(fn($e) => Limit::perMinute(10));
})
```

---

**See Also:** [[middleware]] | [[routing]] | [[config]]
