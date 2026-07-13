# Eloquent ORM

> Laravel's fluent ORM for database interactions with models and relationships.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Database

## Model Definition

```php
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    protected $table      = 'posts';         // default: snake_plural class name
    protected $primaryKey = 'id';            // default: 'id'
    protected $keyType    = 'int';
    public    $incrementing = true;
    public    $timestamps   = true;          // created_at, updated_at
    protected $dateFormat   = 'U';           // Unix timestamp format

    // Mass-assignment
    protected $fillable = ['title', 'body', 'user_id'];
    // OR
    protected $guarded  = [];                // allow all (use with caution)
}
```

## Attribute Casting

```php
// L10+: use method instead of property
protected function casts(): array
{
    return [
        'published_at'  => 'datetime',
        'metadata'      => 'array',
        'is_active'     => 'boolean',
        'price'         => 'decimal:2',
        'status'        => Status::class,      // Enum cast
        'password'      => 'hashed',           // auto-hash on set
        'options'       => AsCollection::class,
        'address'       => AsValueObject::class,
    ];
}
```

## Hidden & Appended Attributes

```php
// Hidden from serialization
protected $hidden = ['password', 'remember_token'];

// Always appended
protected $appends = ['full_name'];

// Accessors (L9+ syntax)
protected function fullName(): Attribute
{
    return Attribute::make(
        get: fn() => $this->first_name.' '.$this->last_name,
    );
}

// Mutator
protected function title(): Attribute
{
    return Attribute::make(
        get: fn($v) => ucfirst($v),
        set: fn($v) => strtolower($v),
    );
}
```

## Model Pruning

```php
use Illuminate\Database\Eloquent\Prunable;

class Post extends Model
{
    use Prunable;

    public function prunable(): Builder
    {
        return static::where('created_at', '<', now()->subMonths(3));
    }
}

// Run: php artisan model:prune
```

## Querying

### Retrieval

```php
Post::all();
Post::all(['id', 'title']);

// Find
Post::find(1);
Post::find([1, 2, 3]);
Post::findOrFail(1);
Post::findOrNew(1);
Post::findOr(1, fn() => abort(404));

// First
Post::first();
Post::firstWhere('is_active', true);
Post::firstOrFail();
Post::firstOrCreate(['email' => $email], ['name' => $name]);
Post::firstOrNew(['email' => $email], ['name' => $name]);
Post::sole();                  // expect exactly 1 result
```

### Where Clauses

```php
Post::where('status', 'published')->get();
Post::where('status', '!=', 'draft')->get();
Post::where('views', '>', 100)->get();
Post::whereNull('deleted_at')->get();
Post::whereNotNull('published_at')->get();
Post::whereBetween('price', [10, 100])->get();
Post::whereNotBetween('price', [10, 100])->get();
Post::whereIn('status', ['published', 'featured'])->get();
Post::whereNotIn('status', ['draft'])->get();
Post::whereDate('created_at', '2025-01-01')->get();
Post::whereYear('created_at', 2025)->get();
Post::whereMonth('created_at', 1)->get();
Post::whereDay('created_at', 15)->get();
Post::whereColumn('updated_at', '>', 'created_at')->get();
Post::whereJsonContains('options->roles', 'admin')->get();
Post::whereJsonLength('options->tags', '>', 3)->get();

// Or where
Post::where('status', 'published')->orWhere('featured', true)->get();
Post::where(fn($q) => $q->where('a', 1)->orWhere('b', 2))->get();
```

### Ordering, Grouping, Limits

```php
Post::orderBy('created_at', 'desc')->get();
Post::orderByDesc('created_at')->get();
Post::latest()->get();             // orderBy created_at desc
Post::oldest()->get();             // orderBy created_at asc
Post::latest('published_at')->get();
Post::inRandomOrder()->first();
Post::groupBy('category')->get();
Post::having('views', '>', 100)->get();
Post::take(5)->get();
Post::limit(5)->offset(10)->get();
Post::skip(10)->take(5)->get();
```

### Selections

```php
Post::select('id', 'title')->get();
Post::selectRaw('count(*) as total, status')->groupBy('status')->get();
Post::addSelect('published_at')->get();
```

### Aggregates

```php
Post::count();
Post::max('views');
Post::min('price');
Post::avg('price');
Post::sum('views');
Post::exists();
Post::doesntExist();
Post::where('status', 'published')->count();
```

### Chunking & Lazy Loading

```php
// Chunking (memory-friendly)
Post::chunk(200, function (Collection $posts) {
    foreach ($posts as $post) { /* ... */ }
});
Post::chunkById(200, function (Collection $posts) { /* ... */ });

// Lazy (generator)
foreach (Post::lazy() as $post) { /* ... */ }
Post::lazyById(200)->each(fn($post) => ...);

// Cursor (single query, yields models)
foreach (Post::where(...)->cursor() as $post) { /* ... */ }
```

### Pluck & Extract

```php
Post::pluck('title');
Post::pluck('title', 'id');       // key => value Collection

// Single value
Post::where('id', 1)->value('title');
```

### Inserts

```php
Post::create(['title' => 'Hello', 'body' => '...']);

Post::updateOrCreate(
    ['email' => 'john@example.com'],     // search criteria
    ['name' => 'John', 'age' => 30],     // values to set
);

Post::upsert([
    ['id' => 1, 'title' => 'A', 'views' => 5],
    ['id' => 2, 'title' => 'B', 'views' => 3],
], uniqueBy: ['id'], update: ['views']);
```

### Updates

```php
Post::where('status', 'draft')->update(['status' => 'published']);
Post::where('id', 1)->increment('views');
Post::where('id', 1)->increment('views', 5, ['updated_at' => now()]);
Post::where('id', 1)->decrement('stock');
```

### Deletes

```php
$post->delete();
Post::where('status', 'draft')->delete();
Post::destroy([1, 2, 3]);
Post::destroy(collect([1, 2, 3]));
```

## Soft Deletes

```php
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model 
{ 
    use SoftDeletes; 
}
// Migration: $table->softDeletes();

$post->delete();               // sets deleted_at
$post->restore();
$post->forceDelete();

Post::withTrashed()->get();
Post::onlyTrashed()->get();
Post::withTrashed()->where('id', 1)->restore();
Post::trashed()->forceDelete();
```

## Relationships

### One-to-One

```php
public function profile(): HasOne
{
    return $this->hasOne(Profile::class, 'user_id', 'id');
}

// Inverse:
public function user(): BelongsTo
{
    return $this->belongsTo(User::class, 'user_id', 'id');
}
```

### One-to-Many

```php
public function posts(): HasMany
{
    return $this->hasMany(Post::class);
}
```

### Many-to-Many

```php
public function roles(): BelongsToMany
{
    return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id')
                ->withPivot('assigned_at')
                ->withTimestamps()
                ->as('assignment');           // pivot alias
}
// Access: $user->roles->first()->assignment->assigned_at
```

### Has-Many-Through

```php
public function deployments(): HasManyThrough
{
    return $this->hasManyThrough(Deployment::class, Environment::class);
}
```

### Polymorphic Relationships

```php
// In migration: $table->morphs('commentable');
public function comments(): MorphMany
{
    return $this->morphMany(Comment::class, 'commentable');
}

public function commentable(): MorphTo
{
    return $this->morphTo();
}
```

### Many-to-Many Polymorphic

```php
public function tags(): MorphToMany
{
    return $this->morphToMany(Tag::class, 'taggable');
}
```

## Eager Loading

```php
Post::with('author')->get();
Post::with(['author', 'comments'])->get();
Post::with('author:id,name')->get();          // specific columns
Post::with(['comments' => function ($q) {
    $q->latest()->limit(5);
}])->get();
Post::with('author.profile')->get();           // nested
Post::withCount('comments')->get();            // adds comments_count
Post::withSum('orderItems', 'price')->get();   // adds order_items_sum_price
Post::withAvg('reviews', 'rating')->get();
Post::withMin('reviews', 'rating')->get();
Post::withMax('reviews', 'rating')->get();
Post::withExists('comments')->get();           // adds comments_exists (bool)

// Lazy eager loading
$posts = Post::all();
$posts->load('author', 'comments');
$posts->loadCount('comments');
$posts->loadMissing('author');                 // only if not already loaded

// Prevent lazy loading
Model::preventLazyLoading(!app()->isProduction());
```

---

**See Also:** [[query-builder]] | [[schema-migrations]] | [[eloquent-relationships]] | [[eloquent-scopes]]
