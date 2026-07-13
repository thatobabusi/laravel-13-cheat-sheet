# Config

> Access and manage application configuration at runtime.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Core Framework

## Reading Configuration

```php
// Read a config value
config('app.name');

// Read with default fallback
config('mail.from.address', 'fallback@example.com');

// Check existence
Config::has('services.stripe.key');
```

## Setting Configuration at Runtime

```php
// Set values (affects current request only)
config(['app.locale' => 'en']);

// Retrieve all config values
config()->all();
```

---

**See Also:** [[application-bootstrap]] | [[environment]]
