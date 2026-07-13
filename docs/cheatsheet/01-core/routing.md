# Routing

> Define application routes with parameters, groups, constraints, and model binding.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Core Framework

## Basic Routes

```php
// routes/web.php or routes/api.php
Route::get('/posts', [PostController::class, 'index']);
Route::post('/posts', [PostController::class, 'store']);
Route::put('/posts/{post}', [PostController::class, 'update']);
Route::patch('/posts/{post}', [PostController::class, 'update']);
Route::delete('/posts/{post}', [PostController::class, 'destroy']);
Route::any('/posts', [PostController::class, 'index']);
Route::match(['get', 'post'], '/posts', [PostController::class, 'index']);

// Closure route
Route::get('/welcome', fn() => view('welcome'));

// API routes (routes/api.php — prefix /api auto-applied)
Route::get('/users', [UserController::class, 'index']);
```

## Route Parameters

```php
Route::get('/posts/{post}', [PostController::class, 'show']);
Route::get('/posts/{post?}', [PostController::class, 'show']);  // optional

// Constraints
Route::get('/users/{id}', fn($id) => ...)->where('id', '[0-9]+');
Route::get('/users/{id}', fn($id) => ...)->whereNumber('id');
Route::get('/slugs/{slug}', fn($slug) => ...)->whereAlphaNumeric('slug');
Route::get('/search/{query}', fn($q) => ...)->whereAlpha('query');
Route::get('/posts/{category}/{post}', fn($c, $p) => ...)->whereIn('category', ['tech','life']);

// Global constraints (AppServiceProvider::boot)
Route::pattern('id', '[0-9]+');
```

## Route Groups

```php
Route::prefix('admin')->name('admin.')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('posts', PostController::class);
});

// Controller shorthand (L9+)
Route::controller(PostController::class)->group(function () {
    Route::get('/posts', 'index');
    Route::post('/posts', 'store');
});

// Subdomain routing
Route::domain('{account}.example.com')->group(function () {
    Route::get('/', [AccountController::class, 'show']);
});
```

## Named Routes

```php
Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');

// Generate URLs
route('posts.show', ['post' => $post]);         // /posts/1
route('posts.show', $post);                     // model resolved automatically
url()->route('posts.show', $post, absolute: false);  // relative URL

// Check current route
request()->routeIs('posts.*');
```

## Resource Routes

```php
Route::resource('posts', PostController::class);
Route::resource('posts', PostController::class)->only(['index', 'show']);
Route::resource('posts', PostController::class)->except(['destroy']);
Route::resource('posts', PostController::class)->shallow();    // shallow nesting

// Nested resource
Route::resource('posts.comments', CommentController::class);

// API resource (no create/edit)
Route::apiResource('posts', PostController::class);

// Singleton resource (settings page)
Route::singleton('profile', ProfileController::class);
Route::apiSingleton('profile', ProfileController::class);
```

## Route Model Binding

### Implicit Binding

```php
// Type-hint matches route segment name
Route::get('/posts/{post}', function (Post $post) { 
    return $post->title; 
});
```

### Explicit Binding

```php
// AppServiceProvider::boot
Route::model('post', Post::class);
```

### Custom Resolution

```php
Route::bind('post', fn($value) => Post::where('slug', $value)->firstOrFail());

// Resolve by different column
Route::get('/posts/{post:slug}', fn(Post $post) => ...);

// Scoped binding (child scoped to parent)
Route::get('/users/{user}/posts/{post:slug}', fn(User $user, Post $post) => ...);
```

### Model Query Customization

```php
// Override in model
public function resolveRouteBindingQuery($query, $value, $field = null)
{
    return $query->where($field ?? 'slug', $value)->withTrashed();
}
```

## Redirect & Fallback Routes

```php
Route::redirect('/old', '/new', 301);
Route::permanentRedirect('/old', '/new');

Route::view('/about', 'about');
Route::view('/about', 'about', ['name' => 'Laravel']);

Route::fallback(fn() => view('errors.404'));
```

---

**See Also:** [[controllers]] | [[requests]] | [[responses]] | [[middleware]]
