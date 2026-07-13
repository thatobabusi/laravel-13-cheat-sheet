# Authorization

> Control what authenticated users can do with gates and policies.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Authentication & Authorization

## Gates

Define in AppServiceProvider::boot:

```php
Gate::define('update-post', function (User $user, Post $post) {
    return $user->id === $post->user_id;
});

Gate::define('view-admin', fn(User $user) => $user->is_admin);
```

## Check Gates

```php
Gate::allows('update-post', $post);
Gate::denies('update-post', $post);
Gate::any(['update-post', 'delete-post'], $post);
Gate::none(['update-post', 'delete-post'], $post);
Gate::check('update-post', $post);
Gate::authorize('update-post', $post);        // throws 403 if denied
Gate::inspect('update-post', $post);          // returns Response
Gate::forUser($user)->allows('update-post', $post);
```

## Controllers

```php
$this->authorize('update', $post);
$this->authorize('create', Post::class);
$this->authorizeResource(Post::class, 'post');  // maps all resource actions
```

## Policies

Create a policy:

```bash
php artisan make:policy PostPolicy --model=Post
```

### Policy Methods

```php
class PostPolicy
{
    public function viewAny(User $user): bool { return true; }
    public function view(User $user, Post $post): bool { return true; }
    public function create(User $user): bool { return $user->is_verified; }
    public function update(User $user, Post $post): bool { return $user->id === $post->user_id; }
    public function delete(User $user, Post $post): bool { return $user->id === $post->user_id; }
    public function restore(User $user, Post $post): bool { return $user->is_admin; }
    public function forceDelete(User $user, Post $post): bool { return $user->is_admin; }
}
```

### Return Response for Richer Feedback

```php
public function update(User $user, Post $post): Response
{
    return $user->id === $post->user_id
        ? Response::allow()
        : Response::deny('You do not own this post.', 403);
}
```

### Before Hook

```php
// Skip authorization for admins
public function before(User $user, string $ability): bool|null
{
    if ($user->is_admin) return true;
    return null;                           // defer to specific method
}
```

## Register Policy

Auto-discovered in L9+ if models match, or register in AppServiceProvider::boot:

```php
Gate::policy(Post::class, PostPolicy::class);
```

## Blade

```blade
@can('update', $post) ... @endcan
@cannot('update', $post) ... @endcannot
```

---

**See Also:** [[authentication-sanctum]] | [[gates]]
