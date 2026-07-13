# Service Container

> Register and resolve classes from the application service container.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Patterns

## Binding

```php
use Illuminate\Support\Facades\App;

// Bind class to container
app()->bind(PaymentGateway::class, StripeGateway::class);
app()->bind(PaymentGateway::class, fn($app) => new StripeGateway(
    config('services.stripe.key')
));
```

## Singleton

```php
app()->singleton(ApiClient::class, fn($app) => new ApiClient(
    config('services.api.url')
));
```

## Scoped

Singleton scoped to request lifecycle:

```php
app()->scoped(RequestContext::class, fn() => new RequestContext());
```

## Instance

```php
app()->instance(ApiClient::class, $client);
```

## Contextual Binding

```php
app()->when(PhotoController::class)
     ->needs(Filesystem::class)
     ->give(fn() => Storage::disk('photos'));
```

## Tagging

```php
app()->tag([CsvExporter::class, PdfExporter::class], 'exporters');
app()->tagged('exporters');   // all tagged bindings
```

## Resolving

```php
$gateway = app(PaymentGateway::class);
$gateway = app()->make(PaymentGateway::class);
$gateway = app()->makeWith(PaymentGateway::class, ['key' => 'val']);
$gateway = resolve(PaymentGateway::class);
```

## Checking Bindings

```php
app()->bound(PaymentGateway::class);
app()->resolved(PaymentGateway::class);
```

## Call with Injection

```php
app()->call([OrderController::class, 'store']);
app()->call(fn(PaymentGateway $gw) => $gw->charge($amount));
```

---

**See Also:** [[service-providers]] | [[dependency-injection]]
