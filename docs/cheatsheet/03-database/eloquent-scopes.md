# Eloquent Scopes & Observers

> Use scopes to reuse query logic and observers to react to model events.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Database

## Local Scopes

```php
// Define in model
public function scopePublished(Builder $query): void
{
    $query->where('status', 'published');
}

public function scopeOfType(Builder $query, string $type): void
{
    $query->where('type', $type);
}

// Usage:
Post::published()->ofType('news')->get();
```

## Global Scopes

Apply automatically to all queries:

```php
use Illuminate\Database\Eloquent\Scope;

class ActiveScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $builder->where('is_active', true);
    }
}

// Register in model:
protected static function booted(): void
{
    static::addGlobalScope(new ActiveScope);
    static::addGlobalScope('active', fn($b) => $b->where('is_active', true));
}

// Remove:
Post::withoutGlobalScope(ActiveScope::class)->get();
Post::withoutGlobalScopes()->get();
```

## Model Events

```php
protected static function booted(): void
{
    static::creating(fn(Post $post) => $post->slug = Str::slug($post->title));
    static::created(fn(Post $post) => event(new PostCreated($post)));
    static::updating(fn($post) => ...);
    static::updated(fn($post) => ...);
    static::saving(fn($post) => ...);      // before create OR update
    static::saved(fn($post) => ...);
    static::deleting(fn($post) => ...);
    static::deleted(fn($post) => ...);
    static::restoring(fn($post) => ...);
    static::restored(fn($post) => ...);
    static::forceDeleting(fn($post) => ...);
    static::forceDeleted(fn($post) => ...);
    static::retrieved(fn($post) => ...);
}
```

## Observers

Create a dedicated observer class:

```bash
php artisan make:observer PostObserver --model=Post
```

```php
class PostObserver
{
    public function creating(Post $post): void { ... }
    public function created(Post $post): void { ... }
    public function updating(Post $post): void { ... }
    public function updated(Post $post): void { ... }
    public function deleting(Post $post): void { ... }
    public function deleted(Post $post): void { ... }
}

// Register in AppServiceProvider::boot:
Post::observe(PostObserver::class);
```

---

**See Also:** [[eloquent-orm]] | [[events-listeners]]
