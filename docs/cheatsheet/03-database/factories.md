# Model Factories

> Factories generate model instances for testing and seeding.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Database

## Creating a Factory

```bash
php artisan make:factory PostFactory
```

## Defining a Factory

```php
// database/factories/PostFactory.php
class PostFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title'  => fake()->sentence(),
            'body'   => fake()->paragraphs(3, true),
            'status' => 'draft',
        ];
    }

    public function published(): static
    {
        return $this->state(['status' => 'published']);
    }

    public function withAuthor(User $user): static
    {
        return $this->state(['user_id' => $user->id]);
    }
}
```

## Using Factories

### In Tests/Seeders

```php
Post::factory()->create();
Post::factory(10)->create();
Post::factory()->published()->create();
Post::factory()->for(User::factory())->create();   // belongsTo
Post::factory()->has(Comment::factory(3))->create();  // hasMany
Post::factory()->hasComments(3)->create();         // magic shorthand
Post::factory()->make();                           // don't persist
Post::factory()->raw();                            // plain array
```

### With Sequences

```php
Post::factory()->sequence(
    ['status' => 'draft'],
    ['status' => 'published'],
)->count(4)->create();
```

---

**See Also:** [[eloquent-orm]] | [[testing]]
