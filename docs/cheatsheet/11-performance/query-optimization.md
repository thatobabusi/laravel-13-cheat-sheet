# Query Optimization

## Eager Loading vs Lazy Loading

### Lazy Loading (N+1 Problem)
```php
// Bad: causes N+1 queries
$users = User::all();
foreach ($users as $user) {
    echo $user->posts; // Triggers query for each user
}
```

### Eager Loading with with()
```php
// Good: loads all posts in single query
$users = User::with('posts')->get();
foreach ($users as $user) {
    echo $user->posts; // Already loaded
}
```

### Multiple Relations
```php
$users = User::with('posts', 'comments', 'profile')->get();

// Nested relations
$posts = Post::with('author.profile', 'comments.user')->get();
```

### Lazy Eager Loading
```php
$users = User::all();
// Load relations after initial query
$users->load('posts', 'comments');
```

## Select Optimization

### Select Specific Columns
```php
// Bad: retrieves all columns
$users = User::all();

// Good: only needed columns
$users = User::select('id', 'name', 'email')->get();

// With relations
$posts = Post::select('id', 'title', 'user_id')
    ->with('author:id,name,email')
    ->get();
```

## Query Chunking

### Process Large Datasets
```php
// Process 100 records at a time
User::chunk(100, function ($users) {
    foreach ($users as $user) {
        // Process user
    }
});

// With cursor (memory efficient)
User::cursor()->each(function ($user) {
    // Process each user
});
```

## Database Indexing Patterns

### Create Indexes in Migration
```php
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->unsignedBigInteger('user_id');
    
    // Single column index
    $table->index('title');
    
    // Composite index
    $table->index(['user_id', 'published_at']);
    
    // Unique index
    $table->unique('slug');
    
    // Foreign key (creates index automatically)
    $table->foreign('user_id')->references('id')->on('users');
});
```

## Pagination Best Practices

### Basic Pagination
```php
$posts = Post::paginate(15);

// Access pagination data
$posts->links(); // Render links
$posts->total(); // Total records
$posts->currentPage(); // Current page
$posts->perPage(); // Items per page
```

### Cursor Pagination (More Efficient)
```php
// Better for large datasets
$posts = Post::orderBy('id')->cursorPaginate(15);
```

### Simple Pagination
```php
// Doesn't count total records
$posts = Post::simplePaginate(15);
```

## Exists() vs Count()

```php
// Bad: loads all records then counts
if (Post::where('user_id', $id)->count() > 0) { }

// Good: just checks existence
if (Post::where('user_id', $id)->exists()) { }

// Good: check NOT exists
if (Post::where('user_id', $id)->doesntExist()) { }
```

## Query Caching

### Cache Query Results
```php
$posts = Cache::remember('posts:user:' . $user->id, 3600, function () {
    return Post::where('user_id', $user->id)->get();
});
```

## Query Builder Methods

### whereRaw for Complex Conditions
```php
Post::whereRaw('published_at > NOW()')
    ->where('views', '>', 100)
    ->get();
```

### Aggregation Methods
```php
// Count
Post::count();

// Sum, Avg, Min, Max
Post::sum('views');
Post::avg('rating');
Post::min('created_at');
Post::max('updated_at');
```

## See Also
- [[database-eloquent]]
- [[caching-strategies]]
- [[performance-profiling]]
