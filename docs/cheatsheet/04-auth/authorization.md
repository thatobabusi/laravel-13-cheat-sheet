# Authorization

## Gates

### Defining Gates

```php
// In AuthServiceProvider boot() method
Gate::define('update-post', function (User $user, Post $post) {
    return $user->id === $post->user_id;
});

Gate::define('create-post', function (User $user) {
    return $user->is_admin;
});
```

### Using Gates

```php
// Check authorization
if (Gate::allows('update-post', $post)) {
    // User is authorized
}

if (Gate::denies('update-post', $post)) {
    // User is not authorized
}

// In controller
if (auth()->user()->can('update-post', $post)) {
    // Authorized
}

// Throw exception if not authorized
Gate::authorize('update-post', $post); // Throws AuthorizationException
```

## Policies

### Creating Policies

```php
// Generate policy: php artisan make:policy PostPolicy --model=Post
namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    // Ability checks
    public function create(User $user): bool
    {
        return $user->is_verified;
    }

    public function view(User $user, Post $post): bool
    {
        return true; // Anyone can view
    }

    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    // Before/After hooks
    public function before(User $user, string $ability): bool|null
    {
        if ($user->is_admin) {
            return true; // Admin can do anything
        }
        return null; // Fall through to policy
    }
}
```

### Registering Policies

```php
// In AuthServiceProvider
protected $policies = [
    Post::class => PostPolicy::class,
];
```

### Using Policies

```php
// Direct call
$policy = new PostPolicy();
$authorized = $policy->update(auth()->user(), $post);

// Via user
if (auth()->user()->can('update', $post)) {
    // Authorized
}

if (auth()->user()->cannot('delete', $post)) {
    // Not authorized
}

// In views
@can('update', $post)
    <p>You can update this post</p>
@endcan

@cannot('delete', $post)
    <p>You cannot delete this post</p>
@endcannot
```

## Authorization in Controllers

```php
namespace App\Http\Controllers;

use App\Models\Post;

class PostController extends Controller
{
    public function update(Post $post)
    {
        $this->authorize('update', $post);
        
        // Update post
    }

    // With implicit policy methods
    public function show(Post $post)
    {
        $this->authorize('view', $post);
        return view('posts.show', compact('post'));
    }

    // Resource authorization
    public function create()
    {
        $this->authorize('create', Post::class);
    }
}
```

## Authorization in Routes

```php
Route::put('/posts/{post}', [PostController::class, 'update'])
    ->middleware('can:update,post');

Route::post('/posts', [PostController::class, 'store'])
    ->middleware('can:create,App\Models\Post');
```

## Model Policies

```php
// Implicit policy binding
Route::put('/posts/{post}', [PostController::class, 'update'])
    ->can('update', 'post');

// Direct policy
Route::put('/posts/{post}', [PostController::class, 'update'])
    ->middleware('can:update,post');
```

## Authorizing Actions

```php
// Authorize or throw
$this->authorize('update', $post);

// With custom response
if (! Gate::allows('update-post', $post)) {
    abort(403);
}

// In middleware
public function handle($request, Closure $next)
{
    Gate::authorize('admin-area');
    return $next($request);
}
```

## Guest User Authorization

```php
// Allow guests
Gate::define('view-post', function (?User $user) {
    return true; // Null when guest
});

// Policy
public function view(?User $user, Post $post): bool
{
    return $post->is_published;
}
```
